/**
 * Deployment rework rate: (Number of issues labeled "incidents" closed and PRs labeled "hotfix" submitted) / number of successful deployments \* 100
 * @param {{id: number, project_id: number, created_timestamp: string, closed_timestamp: string, status: string, labels: string[]}[]} issues
 * @param {{ id: number, project_id: number, merged_timestamp: string, first_commit_timestamp: string, labels: string[], submitted_timestamp: string, target_branch: string }} prs
 * @param {{ project_id: number, id: number, target: string, status: string, timestamp: string, workflow_run_id: string}} deployments
 * @returns {number}
 */
const getDeploymentReworkRate = (issues, prs, deployments) => {
  const incidents = issues.filter((item) => {
    const isIncident = item.labels.includes("incident");

    return isIncident;
  });

  const hotfixes = prs.filter((item) => {
    const isHotfix =
      item.labels.includes("hotfix") || item.labels.includes("hot-fix");

    return isHotfix;
  });

  const successfulDeployments = deployments.filter(
    (deployment) => deployment.status === "success",
  );

  return (incidents.length + hotfixes.length / successfulDeployments) * 100;
};

export default getDeploymentReworkRate;
