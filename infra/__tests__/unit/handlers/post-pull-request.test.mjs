// AWS
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";
import { mockClient } from "aws-sdk-client-mock";

// Jest
import { jest } from "@jest/globals";

// Custom
import { postPullRequestHandler } from "../../../src/handlers/post-pull-request.mjs";

describe("postPullRequestHandler", () => {
  const ddbMock = mockClient(DynamoDBDocumentClient);
  const project_id = 1322323232;
  const timestamp = "2026-10-12T14:30:00.000Z";
  const pullRequestEvent = {
    id: 101,
    project_id,
    merged_timestamp: timestamp,
    first_commit_timestamp: timestamp,
    labels: ["enhancement", "bugfix"],
    submitted_timestamp: timestamp,
    target_branch: "main",
  };
  const expectedItem = {
    project_id: `REPO#${project_id}`,
    event_type_and_timestamp: `PULL_REQUEST#101#${timestamp}`,
    id: 101,
    merged_timestamp: timestamp,
    first_commit_timestamp: timestamp,
    labels: ["enhancement", "bugfix"],
    submitted_timestamp: timestamp,
    target_branch: "main",
  };

  beforeEach(() => {
    ddbMock.reset();
    ddbMock.on(PutCommand).resolves({});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("stores a pull request payload using the project event schema", async () => {
    const result = await postPullRequestHandler({
      httpMethod: "POST",
      body: JSON.stringify(pullRequestEvent),
    });
    const response = JSON.parse(result.body);
    const putCalls = ddbMock.commandCalls(PutCommand);

    expect(result.statusCode).toBe(201);
    expect(response).toEqual({
      message: "Pull request recorded successfully!",
      item: expectedItem,
    });

    expect(putCalls).toHaveLength(1);
  });

  it("returns a server error for malformed JSON", async () => {
    jest.spyOn(console, "error").mockImplementation(() => {});

    const result = await postPullRequestHandler({
      httpMethod: "POST",
      body: "{",
    });
    const response = JSON.parse(result.body);

    expect(result.statusCode).toBe(400);
    expect(response.error).toEqual(expect.any(String));
    expect(response.error).not.toHaveLength(0);
  });

  it("rejects records missing required fields without writing to DynamoDB", async () => {
    const result = await postPullRequestHandler({
      httpMethod: "POST",
      body: JSON.stringify({
        labels: ["bugfix"],
      }),
    });
    const response = JSON.parse(result.body);

    for (const field of [
      "id",
      "project_id",
      "merged_timestamp",
      "first_commit_timestamp",
      "submitted_timestamp",
      "target_branch",
    ]) {
      expect(response.error).toContain(field);
    }

    expect(result.statusCode).toBe(400);
    expect(response.error).toEqual(expect.any(String));
    expect(ddbMock.commandCalls(PutCommand)).toHaveLength(0);
  });
});
