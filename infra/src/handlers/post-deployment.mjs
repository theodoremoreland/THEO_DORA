// AWS
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";

// Utils
import validateDeployment from "../utils/validateDeployment.mjs";

const docClient = DynamoDBDocumentClient.from(new DynamoDBClient({}));
const TABLE_NAME = process.env.PROJECT_EVENTS_TABLE;

export const postDeploymentHandler = async (event) => {
  try {
    const { id, project_id, target, status, timestamp, workflow_run_id } =
      validateDeployment(event.body);

    const timestampISO = new Date(timestamp).toISOString();
    const eventTypeAndTimestamp = `DEPLOYMENT#${id}#${timestampISO}`;
    const repoId = `REPO#${project_id}`;

    const newItem = {
      project_id: repoId, // Partition Key (PK)
      event_type_and_timestamp: eventTypeAndTimestamp, // Sort Key (SK)
      id,
      target,
      status,
      timestamp: timestampISO,
      workflow_run_id,
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
        message: "Deployment recorded successfully!",
        item: newItem,
      }),
    };
  } catch (error) {
    console.error("Error saving deployment:", error);

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
        error: "Could not save deployment record.",
      }),
    };
  }
};
