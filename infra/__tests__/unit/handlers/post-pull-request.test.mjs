import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";
import { mockClient } from "aws-sdk-client-mock";
import { postPullRequestHandler } from "../../../src/handlers/post-pull-request.mjs";

describe("postPullRequestHandler", () => {
  const ddbMock = mockClient(DynamoDBDocumentClient);
  const pullRequestEvent = {
    id: 101,
    project_id: 1322323232,
    merged_timestamp: "2026-10-13T17:00:00Z",
    first_commit_timestamp: "2026-10-10T09:15:00Z",
    labels: ["enhancement", "bugfix"],
    submitted_timestamp: "2026-10-12T14:30:00Z",
    target_branch: "main",
  };
  const expectedItem = {
    project_id: "REPO#1322323232",
    event_type_and_timestamp: "PULL_REQUEST#101#2026-10-13T17:00:00Z",
    id: 101,
    merged_timestamp: "2026-10-13T17:00:00.000Z",
    first_commit_timestamp: "2026-10-10T09:15:00.000Z",
    labels: ["enhancement", "bugfix"],
    submitted_timestamp: "2026-10-12T14:30:00.000Z",
    target_branch: "main",
  };

  beforeEach(() => {
    ddbMock.reset();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("stores a pull request payload using the project event schema", async () => {
    const result = await postPullRequestHandler({
      httpMethod: "POST",
      body: JSON.stringify(pullRequestEvent),
    });

    expect(result.statusCode).toBe(201);
    expect(result.headers).toEqual({ "Content-Type": "application/json" });

    const response = JSON.parse(result.body);
    expect(response).toEqual({
      message: "Pull request recorded successfully!",
      item: expectedItem,
    });

    const putCalls = ddbMock.commandCalls(PutCommand);
    expect(putCalls).toHaveLength(1);
    expect(putCalls[0].args[0].input.Item).toEqual(expectedItem);
  });

  it("returns a server error for malformed JSON without writing to DynamoDB", async () => {
    jest.spyOn(console, "error").mockImplementation(() => {});

    const result = await postPullRequestHandler({
      httpMethod: "POST",
      body: "{",
    });

    expect(result.statusCode).toBe(500);
    expect(JSON.parse(result.body).error).toBe(
      "Could not save pull request record.",
    );
    expect(ddbMock.commandCalls(PutCommand)).toHaveLength(0);
  });

  it("rejects records missing required fields without writing to DynamoDB", async () => {
    const result = await postPullRequestHandler({
      httpMethod: "POST",
      body: JSON.stringify({
        labels: ["bugfix"],
      }),
    });

    expect(result.statusCode).toBe(400);
    expect(JSON.parse(result.body)).toEqual({
      error:
        "Missing required fields: 'id', 'project_id', 'merged_timestamp', 'first_commit_timestamp', 'submitted_timestamp', and 'target_branch'",
    });
    expect(ddbMock.commandCalls(PutCommand)).toHaveLength(0);
  });
});
