// AWS
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";
import { mockClient } from "aws-sdk-client-mock";

// Jest
import { jest } from "@jest/globals";

// Custom
import { postIssueHandler } from "../../../src/handlers/post-issue.mjs";

describe("postIssueHandler", () => {
  const ddbMock = mockClient(DynamoDBDocumentClient);
  const id = 27;
  const project_id = 1322323232;
  const timestamp = "2026-10-12T14:30:00.000Z";
  const issueEvent = {
    id,
    project_id,
    created_timestamp: timestamp,
    closed_timestamp: timestamp,
    status: "closed",
    labels: ["incident"],
  };
  const expectedItem = {
    project_id: `REPO#${project_id}`,
    event_type_and_timestamp: `ISSUE#${id}#${timestamp}`,
    id,
    created_timestamp: timestamp,
    closed_timestamp: timestamp,
    status: "closed",
    labels: ["incident"],
  };

  beforeEach(() => {
    ddbMock.reset();
    ddbMock.on(PutCommand).resolves({});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("stores an issue payload using the project event schema", async () => {
    const result = await postIssueHandler({
      httpMethod: "POST",
      body: JSON.stringify(issueEvent),
    });
    const response = JSON.parse(result.body);
    const putCalls = ddbMock.commandCalls(PutCommand);

    expect(result.statusCode).toBe(201);
    expect(result.headers).toEqual({ "Content-Type": "application/json" });

    expect(response).toEqual({
      message: "Issue recorded successfully!",
      item: expectedItem,
    });

    expect(putCalls).toHaveLength(1);
  });

  it("returns an error for malformed JSON", async () => {
    jest.spyOn(console, "error").mockImplementation(() => {});

    const result = await postIssueHandler({
      httpMethod: "POST",
      body: "{",
    });
    const response = JSON.parse(result.body);

    expect(result.statusCode).toBe(400);
    expect(response.error).toEqual(expect.any(String));
    expect(response.error).not.toHaveLength(0);
  });

  it("rejects records missing required fields", async () => {
    const result = await postIssueHandler({
      httpMethod: "POST",
      body: JSON.stringify({
        created_timestamp: issueEvent.created_timestamp,
        status: issueEvent.status,
        labels: issueEvent.labels,
      }),
    });
    const response = JSON.parse(result.body);

    for (const field of ["id", "project_id", "closed_timestamp"]) {
      expect(response.error).toContain(field);
    }

    expect(result.statusCode).toBe(400);
    expect(response.error).toEqual(expect.any(String));
  });

  it("rejects unsupported statuses", async () => {
    const result = await postIssueHandler({
      httpMethod: "POST",
      body: JSON.stringify({ ...issueEvent, status: "open" }),
    });
    const response = JSON.parse(result.body);

    expect(result.statusCode).toBe(400);
    expect(response.error).toEqual(expect.any(String));
    expect(response.error).not.toHaveLength(0);
  });

  it("returns a server error when DynamoDB fails", async () => {
    jest.spyOn(console, "error").mockImplementation(() => {});
    ddbMock.on(PutCommand).rejects(new Error("DynamoDB unavailable"));

    const result = await postIssueHandler({
      httpMethod: "POST",
      body: JSON.stringify(issueEvent),
    });
    const response = JSON.parse(result.body);

    expect(result.statusCode).toBe(500);
    expect(response.error).toEqual(expect.any(String));
    expect(response.error).not.toHaveLength(0);
    expect(ddbMock.commandCalls(PutCommand)).toHaveLength(1);
  });
});
