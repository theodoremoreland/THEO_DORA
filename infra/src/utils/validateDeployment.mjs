import isValidDate from "./isValidDate.mjs";
import validateEvent from "./validateEvent.mjs";

export const requiredFields = [
  "id",
  "project_id",
  "target",
  "status",
  "timestamp",
  "workflow_run_id",
];
const validTargets = ["aws-amplify", "s3", "lightsail", "github-pages"];
const validStatuses = ["success", "failed"];

const validateDeployment = (deployment) => {
  try {
    const _deployment = JSON.parse(deployment);
    const { target, status, timestamp } = validateEvent(
      _deployment,
      requiredFields,
      "Deployment",
    );

    if (!validTargets.includes(target)) {
      throw new TypeError(
        `Deployment event must have valid target: ${validTargets.join(", ")} and not ${target}`,
      );
    }

    if (!validStatuses.includes(status)) {
      throw new TypeError(
        `Deployment event must have valid status: ${validStatuses.join(", ")} and not ${status}`,
      );
    }

    if (!isValidDate(timestamp)) {
      throw new TypeError(
        `Timestamp must be a valid datetime, not: "${timestamp}"`,
      );
    }

    return _deployment;
  } catch (error) {
    if (error instanceof SyntaxError) {
      // Converting Error type to signal bad request instead of server side issue.
      throw new TypeError("Labels must be a valid array");
    } else {
      throw error;
    }
  }
};

export default validateDeployment;
