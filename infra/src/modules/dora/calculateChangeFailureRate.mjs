/**
 * Change failure rate: Number of deployments with AT LEAST ONE issue labeled "incident" or AT LEAST ONE PR labeled "hotfix" or a failed deployment / total deployment runs \* 100
 * @param {{id: number, project_id: number, created_timestamp: string, closed_timestamp: string, status: string, labels: string[]}[]} issues
 * @param {{ id: number, project_id: number, merged_timestamp: string, first_commit_timestamp: string, labels: string[], submitted_timestamp: string, target_branch: string }} prs
 * @param {{ project_id: number, id: number, target: string, status: string, timestamp: string, workflow_run_id: string}} deployments
 * @returns {number}
 */
const calculateChangeFailureRate = (issues, prs, deployments) => {
  const timeStamps = [];

  for (const deployment of deployments) {
    timeStamps.push(deployment.timestamp);
  }

  timeStamps.sort();

  const incidents = issues.filter((item) => item.labels.includes("incident"));
  const hotfixes = prs.filter((pr) => pr.labels.includes("hotfix"));

  incidents.forEach((inc) => {
    for (let i = timeStamps.length; i > 0; i--) {
      if (timeStamps[i] === null) continue;

      const incidentTime = new Date(inc.created_timestamp);
      const deploymentTime = new Date(timeStamps[i]);

      if (incidentTime > deploymentTime) {
        timeStamps[i] = null;
      }
    }
  });

  const remainingTimestamps = timeStamps.filter((ts) => ts !== null);

  return (deployments.length - remainingTimestamps.length) / deployments.length;
};

export default calculateChangeFailureRate;
