/**
 * Deployment rework rate: (Number of issues labeled "incident" closed and PRs labeled "hotfix" and NOT "incident" merged) / number of deployments
 * @param {{id: number, project_id: number, created_timestamp: string, closed_timestamp: string, status: string, labels: string[]}[]} issues
 * @param {{ id: number, project_id: number, merged_timestamp: string, first_commit_timestamp: string, labels: string[], submitted_timestamp: string, target_branch: string }} prs
 * @param {{ project_id: number, id: number, target: string, status: string, timestamp: string, workflow_run_id: string}} deployments
 * @returns {number}
 */
const calculateDeploymentReworkRate = (issues, prs, deployments) => {
  const incidents = issues.filter((item) => item.labels.includes("incident"));

  /** Assume that if the labels incident and hotfix are both present, it is a duplicate of an issue labeled incident.
   */
  const hotfixes = prs.filter(
    (item) =>
      item.labels.includes("hotfix") && !item.labels.includes("incident"),
  );

  const incidentsCount = incidents.length;
  const hotfixesCount = hotfixes.length;
  const deploymentsCount = deployments.length;

  if (deploymentsCount === 0) {
    return null;
  }

  return Number((incidentsCount + hotfixesCount) / deploymentsCount).toFixed(2);
};

export default calculateDeploymentReworkRate;
