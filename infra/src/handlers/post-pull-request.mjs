import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";

const docClient = DynamoDBDocumentClient.from(new DynamoDBClient({}));
const TABLE_NAME = process.env.PROJECT_EVENTS_TABLE;

export const postPullRequestHandler = async (event) => {
  try {
    const body = JSON.parse(event.body || "{}");

    /**
     * Example:
     * id
     * project_id
     * merged_timestamp
     * first_commit_timestamp
     * labels
     * submitted_timestamp
     * target_branch
     */

    const {
      id,
      project_id,
      merged_timestamp,
      first_commit_timestamp,
      labels,
      submitted_timestamp,
      target_branch,
    } = body;

    if (
      !project_id ||
      !id ||
      !merged_timestamp ||
      !first_commit_timestamp ||
      !submitted_timestamp ||
      !target_branch
    ) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          error:
            "Missing required fields: 'id', 'project_id', 'merged_timestamp', 'first_commit_timestamp', 'submitted_timestamp', and 'target_branch'",
        }),
      };
    }

    const mergedTimestampISO = new Date(merged_timestamp).toISOString();
    const firstCommitTimestampISO = new Date(
      first_commit_timestamp,
    ).toISOString();
    const submittedTimestampISO = new Date(submitted_timestamp).toISOString();
    const eventTypeAndTimestamp = `PULL_REQUEST#${id}#${merged_timestamp}`;
    const repoId = `REPO#${project_id}`;

    const newItem = {
      project_id: repoId, // Partition Key (PK)
      event_type_and_timestamp: eventTypeAndTimestamp, // Sort Key (SK)
      id,
      merged_timestamp: mergedTimestampISO,
      first_commit_timestamp: firstCommitTimestampISO,
      labels,
      submitted_timestamp: submittedTimestampISO,
      target_branch,
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
        message: "Pull request recorded successfully!",
        item: newItem,
      }),
    };
  } catch (error) {
    console.error("Error saving pull request:", error);

    return {
      statusCode: 500,
      body: JSON.stringify({
        error: "Could not save pull request record.",
        TABLE_NAME,
      }),
    };
  }
};
