import {
  DynamoDBDocumentClient,
  PutCommand,
} from "@aws-sdk/lib-dynamodb";
import { mockClient } from "aws-sdk-client-mock";
import { putIssueHandler } from "../../../src/handlers/post-issue.mjs";

describe("postIssueHandler", () => {
  const ddbMock = mockClient(DynamoDBDocumentClient);
  const issueEvent = {
    id: 27,
    project_id: "ProjectList",
    created_timestamp: "2026-10-01T12:00:00Z",
    closed_timestamp: null,
    status: "open",
    labels: ["bug"],
  };

  beforeEach(() => {
    ddbMock.reset();
  });

  it("stores a GitHub issue payload using the project event schema", async () => {
    const result = await putIssueHandler({
      httpMethod: "POST",
      body: JSON.stringify(issueEvent),
    });

    expect(result.statusCode).toBe(201);

    const response = JSON.parse(result.body);
    expect(response.message).toBe("Issue recorded successfully!");
    expect(response.item).toMatchObject({
      project_id: "REPO#ProjectList",
      event_type_and_timestamp: "ISSUE#27#null",
      id: 27,
      created_timestamp: "2026-10-01T12:00:00.000Z",
      closed_timestamp: "1970-01-01T00:00:00.000Z",
      status: "open",
      labels: ["bug"],
    });

    const putCalls = ddbMock.commandCalls(PutCommand);
    expect(putCalls).toHaveLength(1);
    expect(putCalls[0].args[0].input.Item).toEqual({
      project_id: "REPO#ProjectList",
      event_type_and_timestamp: "ISSUE#27#null",
      id: 27,
      created_timestamp: "2026-10-01T12:00:00.000Z",
      closed_timestamp: "1970-01-01T00:00:00.000Z",
      status: "open",
      labels: ["bug"],
    });
  });

  it("rejects malformed JSON without writing to DynamoDB", async () => {
    const result = await putIssueHandler({
      httpMethod: "POST",
      body: "{",
    });

    expect(result.statusCode).toBe(500);
    expect(JSON.parse(result.body)).toEqual({
      error: "Could not save issue record.",
    });
    expect(ddbMock.commandCalls(PutCommand)).toHaveLength(0);
  });

  it("rejects records missing the required project_id and id fields", async () => {
    const result = await putIssueHandler({
      httpMethod: "POST",
      body: JSON.stringify({
        created_timestamp: "2026-10-01T12:00:00Z",
        status: "open",
        labels: ["bug"],
      }),
    });

    expect(result.statusCode).toBe(400);
    expect(JSON.parse(result.body)).toEqual({
      error: "Missing required fields: 'project_id' and 'id'",
    });
    expect(ddbMock.commandCalls(PutCommand)).toHaveLength(0);
  });
});
