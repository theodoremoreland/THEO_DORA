// AWS
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";

// Utils
import validateIssue from "../utils/validateIssue.mjs";

const docClient = DynamoDBDocumentClient.from(new DynamoDBClient({}));
const TABLE_NAME = process.env.PROJECT_EVENTS_TABLE;

export const postIssueHandler = async (event) => {
  try {
    const {
      id,
      project_id,
      created_timestamp,
      closed_timestamp,
      status,
      labels,
    } = validateIssue(event.body);

    const createdTimestampISO = new Date(created_timestamp).toISOString();
    const closedTimestampISO = new Date(closed_timestamp).toISOString();
    const eventTypeAndTimestamp = `ISSUE#${id}#${closedTimestampISO}`; // Format: ISSUE#2026-10-12T23:00:00.000Z
    const projectId = `REPO#${project_id}`;

    const newItem = {
      project_id: projectId, // Partition Key (PK)
      event_type_and_timestamp: eventTypeAndTimestamp, // Sort Key (SK)
      id,
      created_timestamp: createdTimestampISO,
      closed_timestamp: closedTimestampISO,
      status,
      labels,
    };

    const command = new PutCommand({
      TableName: TABLE_NAME,
      Item: newItem,
    });

    await docClient.send(command);

    return {
      statusCode: 201,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message: "Issue recorded successfully!",
        item: newItem,
      }),
    };
  } catch (error) {
    console.error("Error saving issue:", error);

    if (error instanceof TypeError) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          error: error.message,
        }),
      };
    }

    return {
      statusCode: 500,
      body: JSON.stringify({
        error: "Could not save issue record.",
      }),
    };
  }
};
