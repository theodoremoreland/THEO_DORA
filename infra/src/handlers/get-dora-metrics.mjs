// AWS
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, GetCommand } from "@aws-sdk/lib-dynamodb";

const docClient = DynamoDBDocumentClient.from(new DynamoDBClient({}));
const TABLE_NAME = process.env.PROJECT_EVENTS_TABLE;
const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type",
  "Access-Control-Allow-Methods": "GET,OPTIONS",
};

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
      const matchesPrefix = item.sk.startsWith("ORDER#2026");
      const matchesSuffix = item.sk.endsWith("#COMPLETED");

      return matchesPrefix && matchesSuffix;
    });
    const prs = allItems.filter((item) => {
      const matchesPrefix = item.sk.startsWith("ORDER#2026");
      const matchesSuffix = item.sk.endsWith("#COMPLETED");

      return matchesPrefix && matchesSuffix;
    });

    const issues = allItems.filter((item) => {
      const matchesPrefix = item.sk.startsWith("ORDER#2026");
      const matchesSuffix = item.sk.endsWith("#COMPLETED");

      return matchesPrefix && matchesSuffix;
    });

    return {
      statusCode: 200,
      headers: CORS_HEADERS,
      body: JSON.stringify(response.Items),
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
