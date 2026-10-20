// AWS
import { DynamoDBDocumentClient, QueryCommand } from "@aws-sdk/lib-dynamodb";
import { mockClient } from "aws-sdk-client-mock";

// Jest
import { jest } from "@jest/globals";

// Custom
import mockTableData from "./mock-table-data.json" with { type: "json" };
import { getDoraMetricsHandler } from "../../../src/handlers/get-dora-metrics.mjs";

describe("getDoraMetricsHandler", () => {
  const ddbMock = mockClient(DynamoDBDocumentClient);

  beforeEach(() => {
    ddbMock.reset();
    ddbMock.on(QueryCommand).resolves({ Items: mockTableData });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("gets DORA metrics", async () => {
    const result = await getDoraMetricsHandler({
      httpMethod: "GET",
      queryStringParameters: {
        project_id: "1322323232",
      },
    });
    const response = JSON.parse(result.body);
    const queryCalls = ddbMock.commandCalls(QueryCommand);

    console.log(response);
    expect(queryCalls).toHaveLength(1);
  });
});
