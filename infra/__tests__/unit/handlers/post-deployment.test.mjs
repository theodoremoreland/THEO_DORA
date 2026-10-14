// AWS
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";
import { mockClient } from "aws-sdk-client-mock";

// Jest
import { jest } from "@jest/globals";

// Custom
import { requiredFields } from "../../../src/utils/validateDeployment.mjs";
import { postDeploymentHandler } from "../../../src/handlers/post-deployment.mjs";

describe("postDeploymentHandler", () => {
  const ddbMock = mockClient(DynamoDBDocumentClient);
  const id = 101;
  const project_id = 1322323232;
  const timestamp = "2026-10-12T14:30:00.000Z";
  const workflow_run_id = 12121212;
  const deploymentEvent = {
    id,
    project_id,
    target: "aws-amplify",
    status: "success",
    timestamp,
    workflow_run_id,
  };
  const expectedItem = {
    project_id: `REPO#${project_id}`,
    event_type_and_timestamp: `DEPLOYMENT#${id}#${timestamp}`,
    id: 101,
    target: "aws-amplify",
    status: "success",
    timestamp,
    workflow_run_id,
  };

  beforeEach(() => {
    ddbMock.reset();
    ddbMock.on(PutCommand).resolves({});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("stores a pull request payload using the project event schema", async () => {
    const result = await postDeploymentHandler({
      httpMethod: "POST",
      body: JSON.stringify(deploymentEvent),
    });
    const response = JSON.parse(result.body);
    const putCalls = ddbMock.commandCalls(PutCommand);

    expect(result.statusCode).toBe(201);
    expect(response).toEqual({
      message: "Deployment recorded successfully!",
      item: expectedItem,
    });

    expect(putCalls).toHaveLength(1);
  });

  it("returns a server error for malformed JSON", async () => {
    jest.spyOn(console, "error").mockImplementation(() => {});

    const result = await postDeploymentHandler({
      httpMethod: "POST",
      body: "{",
    });
    const response = JSON.parse(result.body);

    expect(result.statusCode).toBe(400);
    expect(response.error).toEqual(expect.any(String));
    expect(response.error).not.toHaveLength(0);
  });

  it("rejects records missing required fields without writing to DynamoDB", async () => {
    const result = await postDeploymentHandler({
      httpMethod: "POST",
      body: JSON.stringify({
        status: "success",
      }),
    });
    const response = JSON.parse(result.body);
    const someFields = requiredFields.filter((field) => field !== "status");

    for (const field of someFields) {
      expect(response.error).toContain(field);
    }

    expect(result.statusCode).toBe(400);
    expect(response.error).toEqual(expect.any(String));
    expect(ddbMock.commandCalls(PutCommand)).toHaveLength(0);
  });
});
