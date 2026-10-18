// AWS
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, GetCommand } from "@aws-sdk/lib-dynamodb";

// Custom
import getRecoveryTime from "../utils/getRecoveryTime.mjs";

const docClient = DynamoDBDocumentClient.from(new DynamoDBClient({}));
const TABLE_NAME = process.env.PROJECT_EVENTS_TABLE;
const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type, X-API-KEY",
  "Access-Control-Allow-Methods": "GET,OPTIONS",
};

/**
 * Formula:

- Lead Time for Changes: average (Deploy action timestamp - First commit of PR timestamp labeled "enhancement" or "bugfix")
  **PRs** and **Deploy action metadata**

- Deployment frequency: average successful "deploy" action runs per week
  **Deploy action metadata**

- Change failure rate: Number of deployments with AT LEAST ONE issue labeled "incident" or AT LEAST ONE PR labeled "hotfix" or a failed deployment / total deployment runs \* 100
  **Deploy action metadata** and **PRs** and **Issues**

- Deployment rework rate: (Number of issues labeled "incidents" closed and PRs labeled "hotfix" submitted) / number of successful deployments \* 100
  **Issues** and **PRs**

- Recovery time: average (issue labeled "incident" closed time - issue labeled "incident" created time)
  **Issues**
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
        KeyConditionExpression: "pk = :pkVal",
        ExpressionAttributeValues: {
          ":pkVal": `REPO#${projectId}`,
        },
        ExclusiveStartKey: lastEvaluatedKey,
      };

      const command = new GetCommand(params);
      const response = await docClient.send(command);

      if (response.Items) {
        allItems = allItems.concat(response.Items);
      }

      lastEvaluatedKey = response.LastEvaluatedKey;
    } while (lastEvaluatedKey);

    const deployments = allItems.filter((item) => {
      const matchesPrefix = item.sk.startsWith("DEPLOYMENT#");

      return matchesPrefix;
    });
    const prs = allItems.filter((item) => {
      const matchesPrefix = item.sk.startsWith("PULL_REQUEST#");

      return matchesPrefix;
    });
    const issues = allItems.filter((item) => {
      const matchesPrefix = item.sk.startsWith("ISSUE#");

      return matchesPrefix;
    });

    return {
      statusCode: 200,
      headers: CORS_HEADERS,
      body: JSON.stringify({
        items: response.Items,
        recoveryTime: getRecoveryTime(issues),
      }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers: CORS_HEADERS,
      body: JSON.stringify({
        error: "Internal Proxy Error",
        details: String(error),
      }),
    };
  }
};
