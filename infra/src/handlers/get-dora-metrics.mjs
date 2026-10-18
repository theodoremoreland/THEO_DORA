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

  const params = {
    TableName: TABLE_NAME,
    // KeyConditionExpression dictates how we query the primary/sort keys efficiently
    KeyConditionExpression: "pk = :pkVal AND begins_with(sk, :skPrefix)",
    ExpressionAttributeValues: {
      ":pkVal": "USER#123",
      ":skPrefix": "ORDER#2026-", // Finds items where SK starts with this
    },
  };

  try {
    // Send the GetCommand to DynamoDB
    const command = new GetCommand(params);
    const response = await docClient.send(command);

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
