import isValidDate from "./isValidDate.mjs";
import validateEvent from "./validateEvent.mjs";

const requiredFields = [
  "id",
  "project_id",
  "created_timestamp",
  "closed_timestamp",
  "status",
  "labels",
];

const validateIssue = (issue) => {
  try {
    const _issue = JSON.parse(issue);
    const { created_timestamp, closed_timestamp, status, labels } =
      validateEvent(_issue, requiredFields, "Issue");

    if (!Array.isArray(labels)) {
      throw new TypeError("Labels must be a valid array");
    }

    if (labels.length === 0) {
      throw new TypeError("Labels array must not be empty");
    }

    if (status !== "closed" && status !== "completed") {
      throw new TypeError(
        `Issue status must be 'closed' or 'completed' not '${status}'`,
      );
    }

    if (!isValidDate(created_timestamp)) {
      throw new TypeError(
        `Created timestamp must be a valid datetime, not: ${created_timestamp}`,
      );
    }

    if (!isValidDate(closed_timestamp)) {
      throw new TypeError(
        `Closed timestamp must be a valid datetime, not: ${closed_timestamp}`,
      );
    }

    return _issue;
  } catch (error) {
    if (error instanceof SyntaxError) {
      // Converting Error type to signal bad request instead of server side issue.
      throw new TypeError("Labels must be a valid array");
    }

    throw error;
  }
};

export default validateIssue;
