import isValidDate from "./isValidDate.mjs";
import validFields from "./validFields.mjs";

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
  const {
    merged_timestamp,
    first_commit_timestamp,
    submitted_timestamp,
    labels,
  } = validFields(pullRequest, requiredFields, "Pull Request");
  let labelsArray;

  try {
    labelsArray = JSON.parse(labels);
  } catch (error) {
    if (error instanceof SyntaxError) {
      // Converting Error type to signal bad request instead of server side issue.
      throw new TypeError("Labels must be a valid array");
    } else {
      throw error;
    }
  }

  if (!Array.isArray(labelsArray)) {
    throw new TypeError("Labels must be a valid array");
  }

  if (labels.length === 0) {
    throw new TypeError("Labels array must not be empty");
  }

  if (!isValidDate(merged_timestamp)) {
    throw new TypeError(
      `Merged timestamp must be a valid datetime, not: "${merged_timestamp_timestamp}"`,
    );
  }

  if (!isValidDate(first_commit_timestamp)) {
    throw new TypeError(
      `First commit timestamp must be a valid datetime, not: "${first_commit_timestamp}"`,
    );
  }

  if (!isValidDate(submitted_timestamp)) {
    throw new TypeError(
      `Submitted timestamp must be a valid datetime, not: "${submitted_timestamp_timestamp}"`,
    );
  }

  return pullRequest;
};

export default validatePullRequest;
