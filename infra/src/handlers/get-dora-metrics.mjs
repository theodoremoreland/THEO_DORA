// AWS
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, QueryCommand } from "@aws-sdk/lib-dynamodb";

// Custom
import {
  calculateLeadTime,
  calculateDeploymentFrequency,
  calculateDeploymentReworkRate,
  calculateRecoveryTime,
  calculateChangeFailureRate,
} from "../modules/dora";

const docClient = DynamoDBDocumentClient.from(new DynamoDBClient({}));
const TABLE_NAME = process.env.PROJECT_EVENTS_TABLE;
const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type, X-API-KEY",
  "Access-Control-Allow-Methods": "GET,OPTIONS",
};

/**
 * - Lead Time for Changes: average (merged timestamp - First commit of PR timestamp labeled "enhancement" or "bugfix")
 * - Deployment frequency: average successful "deploy" action runs per week
 * - Change failure rate: Number of deployments with AT LEAST ONE issue labeled "incident" or AT LEAST ONE PR labeled "hotfix" or a failed deployment / total deployment runs \* 100
 * - Deployment rework rate: (Number of issues labeled "incidents" closed and PRs labeled "hotfix" submitted) / number of successful deployments \* 100
 * - Recovery time: average (issue labeled "incident" closed time - issue labeled "incident" created time)
 */
export const getDoraMetricsHandler = async (event) => {
  const httpMethod = event.requestContext?.http?.method || event.httpMethod;
  const queryParams = event.queryStringParameters ?? {};
  const projectId = queryParams.project_id;

  if (httpMethod === "OPTIONS") {
    return {
      statusCode: 200,
      headers: CORS_HEADERS,
      body: JSON.stringify({ status: "ok" }),
    };
  }

  if (!projectId) {
    return {
      statusCode: 400,
      headers: CORS_HEADERS,
      body: JSON.stringify({
        error: "Invalid request, missing project_id.",
      }),
    };
  }

  let allItems = [];
  let lastEvaluatedKey = undefined;

  try {
    do {
      const params = {
        TableName: TABLE_NAME,
        KeyConditionExpression: "project_id = :pkValue",
        ExpressionAttributeValues: {
          ":pkValue": `REPO#${projectId}`,
        },
        ExclusiveStartKey: lastEvaluatedKey,
      };

      const command = new QueryCommand(params);
      const response = await docClient.send(command);

      if (response.Items) {
        allItems = allItems.concat(response.Items);
      }

      lastEvaluatedKey = response.LastEvaluatedKey;
    } while (lastEvaluatedKey);

    const deployments = [];
    const prs = [];
    const issues = [];

    for (const item of allItems) {
      const t = item.event_type_and_timestamp;

      if (t.startsWith("DEPLOYMENT#")) {
        deployments.push(item);

        continue;
      } else if (t.startsWith("PULL_REQUEST#")) {
        prs.push(item);

        continue;
      } else if (t.startsWith("ISSUE#")) {
        issues.push(item);
      }
    }

    return {
      statusCode: 200,
      headers: CORS_HEADERS,
      body: JSON.stringify({
        items: allItems,
        leadTime: calculateLeadTime(prs),
        deploymentFrequency: calculateDeploymentFrequency(deployments),
        deploymentReworkRate: calculateDeploymentReworkRate(
          issues,
          prs,
          deployments,
        ),
        changeFailureRate: calculateChangeFailureRate(issues, prs, deployments),
        recoveryTime: calculateRecoveryTime(issues),
      }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers: CORS_HEADERS,
      body: JSON.stringify({
        error: "Internal server error",
        details: String(error),
      }),
    };
  }
};
