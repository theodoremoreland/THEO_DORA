const SONAR_TOKEN = process.env.SONAR_TOKEN;
const SONAR_HOST = process.env.SONAR_HOST ?? "https://sonarcloud.io";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type,Authorization",
  "Access-Control-Allow-Methods": "GET,OPTIONS",
};

const METRICS = [
  "security_rating",
  "reliability_rating",
  "sqale_rating",
  "coverage",
  "ncloc",
].join(",");

export const getSonarMeasuresHandler = async (event) => {
  const httpMethod = event.requestContext?.http?.method || event.httpMethod;
  const queryParams = event.queryStringParameters ?? {};
  const projectName = queryParams.project_name;

  if (httpMethod === "OPTIONS") {
    return {
      statusCode: 200,
      headers: CORS_HEADERS,
      body: JSON.stringify({ status: "ok" }),
    };
  }

  if (!SONAR_TOKEN || !projectName) {
    return {
      statusCode: 500,
      headers: CORS_HEADERS,
      body: JSON.stringify({
        error: "Lambda missing SONAR_TOKEN or PROJECT_NAME configuration.",
      }),
    };
  }

  const url = new URL("/api/measures/component", SONAR_HOST);
  url.searchParams.set("component", `theodoremoreland_${projectName}`);
  url.searchParams.set("metricKeys", METRICS);

  try {
    const response = await fetch(url, {
      headers: {
        Authorization: `Basic ${Buffer.from(`${SONAR_TOKEN}:`).toString("base64")}`,
        Accept: "application/json",
      },
    });
    const responseBody = await response.text();

    if (!response.ok) {
      return {
        statusCode: response.status,
        headers: CORS_HEADERS,
        body: JSON.stringify({
          error: "SonarQube API rejected request",
          details: responseBody,
        }),
      };
    }

    const rawData = JSON.parse(responseBody);
    const measures = rawData.component?.measures ?? [];
    const sanitizedMetrics = {};

    for (const measure of measures) {
      if (!Object.hasOwn(measure, "value")) {
        continue;
      }

      const value = measure.value;
      const isNumericInput =
        typeof value === "number" ||
        typeof value === "boolean" ||
        (typeof value === "string" && value.trim() !== "");
      const numericValue = isNumericInput ? Number(value) : Number.NaN;

      sanitizedMetrics[measure.metric] = Number.isNaN(numericValue)
        ? value
        : measure.metric === "coverage"
          ? Math.round((numericValue + Number.EPSILON) * 100) / 100
          : numericValue;
    }

    return {
      statusCode: 200,
      headers: CORS_HEADERS,
      body: JSON.stringify({
        project_name: projectName,
        metrics: sanitizedMetrics,
      }),
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
