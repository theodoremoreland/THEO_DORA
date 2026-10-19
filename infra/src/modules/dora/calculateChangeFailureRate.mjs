/**
 * Change failure rate: Number of deployments with AT LEAST ONE issue labeled "incident" or AT LEAST ONE PR labeled "hotfix" or a failed deployment / total deployment runs \* 100
 * @param {{id: number, project_id: number, created_timestamp: string, closed_timestamp: string, status: string, labels: string[]}[]} issues
 * @param {{ id: number, project_id: number, merged_timestamp: string, first_commit_timestamp: string, labels: string[], submitted_timestamp: string, target_branch: string }} prs
 * @param {{ project_id: number, id: number, target: string, status: string, timestamp: string, workflow_run_id: string}} deployments
 * @returns {number}
 */
const getChangeFailureRate = (issues, prs, deployments) => {
  const incidents = issues.filter((item) => {
    const isIncident = item.labels.includes("incident");

    return isIncident;
  });

  const hotfixes = prs.filter((pr) => pr.labels.includes("hotfix"));

  return 0;
};

export default getChangeFailureRate;
