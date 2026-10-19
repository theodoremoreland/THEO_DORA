/**
 * Lead Time for Changes: average (Merge timestamp - First commit of PR timestamp labeled "enhancement" or "bugfix")
 * @param {{ id: number, project_id: number, merged_timestamp: string, first_commit_timestamp: string, labels: string[], submitted_timestamp: string, target_branch: string }} prs
 * @returns {number}
 */
const calculateLeadTime = (prs) => {
  let totalDifferenceBetweenChanges = 0;

  if (prs.length === 0) {
    return null;
  }

  const changes = prs.filter((pr) => {
    const isChange =
      pr.labels.includes("enhancement") || pr.labels.includes("bugfix");

    return isChange;
  });

  for (const item of changes) {
    const mergedTime = item.merged_timestamp;
    const first_commit_timestamp = item.first_commit_timestamp;

    const difference =
      new Date(mergedTime).getTime() -
      new Date(first_commit_timestamp).getTime();

    totalDifferenceBetweenChanges += difference;
  }

  return totalDifferenceBetweenChanges / changes.length;
};

export default calculateLeadTime;
