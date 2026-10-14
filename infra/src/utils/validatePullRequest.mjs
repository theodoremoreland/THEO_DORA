import isValidDate from "./isValidDate.mjs";
import validateEvent from "./validateEvent.mjs";

const requiredFields = [
  "id",
  "project_id",
  "merged_timestamp",
  "first_commit_timestamp",
  "labels",
  "submitted_timestamp",
  "target_branch",
];

const validatePullRequest = (pullRequest) => {
  try {
    const _pullRequest = JSON.parse(pullRequest);
    const {
      merged_timestamp,
      first_commit_timestamp,
      submitted_timestamp,
      labels,
    } = validateEvent(_pullRequest, requiredFields, "Pull Request");

    if (!Array.isArray(labels)) {
      throw new TypeError("Labels must be a valid array");
    }

    if (labels.length === 0) {
      throw new TypeError("Labels array must not be empty");
    }

    if (!isValidDate(merged_timestamp)) {
      throw new TypeError(
        `Merged timestamp must be a valid datetime, not: "${merged_timestamp}"`,
      );
    }

    if (!isValidDate(first_commit_timestamp)) {
      throw new TypeError(
        `First commit timestamp must be a valid datetime, not: "${first_commit_timestamp}"`,
      );
    }

    if (!isValidDate(submitted_timestamp)) {
      throw new TypeError(
        `Submitted timestamp must be a valid datetime, not: "${submitted_timestamp}"`,
      );
    }

    return _pullRequest;
  } catch (error) {
    if (error instanceof SyntaxError) {
      // Converting Error type to signal bad request instead of server side issue.
      throw new TypeError("Labels must be a valid array");
    } else {
      throw error;
    }
  }
};

export default validatePullRequest;
