/**
 * Change failure rate: Number of deployments with AT LEAST ONE issue labeled "incident" or AT LEAST ONE PR labeled "hotfix" or a failed deployment / total deployment runs \* 100
 * @param {{id: number, project_id: number, created_timestamp: string, closed_timestamp: string, status: string, labels: string[]}[]} issues
 * @param {{ id: number, project_id: number, merged_timestamp: string, first_commit_timestamp: string, labels: string[], submitted_timestamp: string, target_branch: string }} prs
 * @param {{ project_id: number, id: number, target: string, status: string, timestamp: string, workflow_run_id: string}} deployments
 * @returns {number}
 */
const calculateChangeFailureRate = (issues, prs, deployments) => {
  if (deployments.length === 0) {
    return 0;
  }

  const incidents = issues.filter((item) => item.labels.includes("incident"));
  const hotfixes = prs.filter((pr) => pr.labels.includes("hotfix"));

  if (incidents.length === 0 && hotfixes.length === 0) {
    return 0;
  }

  const timeStamps = [];
  const timeStampsBucketed = [];
  const changeFailuresByDeployment = {};

  for (const deployment of deployments) {
    timeStamps.push(deployment.timestamp);
  }

  timeStamps.sort();

  for (let i = 0; i < timeStamps.length; i++) {
    const deploymentTimestamp = timeStamps[i];
    const nextDeploymentTimestamp = timeStamps[i + 1];

    if (nextDeploymentTimestamp) {
      timeStampsBucketed.push([deploymentTimestamp, nextDeploymentTimestamp]);
    } else {
      timeStampsBucketed.push([deploymentTimestamp, undefined]);
    }
  }

  incidents.forEach((inc) => {
    timeStampsBucketed.forEach((timeStampsBucket) => {
      const incidentCreatedTime = new Date(inc.created_timestamp);
      const deploymentTime = new Date(timeStampsBucket[0]);
      const nextDeploymentTime = timeStampsBucket[1]
        ? new Date(timeStampsBucket[1])
        : new Date();
      const deploymentRange = `${deploymentTime.toLocaleString()} - ${nextDeploymentTime.toLocaleString()}`;

      if (changeFailuresByDeployment[deploymentRange] === undefined) {
        changeFailuresByDeployment[deploymentRange] = 0;
      }

      if (
        incidentCreatedTime > deploymentTime &&
        incidentCreatedTime < nextDeploymentTime
      ) {
        changeFailuresByDeployment[deploymentRange]++;
      }
    });
  });

  hotfixes.forEach((hf) => {
    timeStampsBucketed.forEach((timeStampsBucket) => {
      const hfMergedTime = new Date(hf.merged_timestamp);
      const deploymentTime = new Date(timeStampsBucket[0]);
      const nextDeploymentTime = timeStampsBucket[1]
        ? new Date(timeStampsBucket[1])
        : new Date();
      const deploymentRange = `${deploymentTime.toLocaleString()} - ${nextDeploymentTime.toLocaleString()}`;

      if (changeFailuresByDeployment[deploymentRange] === undefined) {
        changeFailuresByDeployment[deploymentRange] = 0;
      }

      if (hfMergedTime > deploymentTime && hfMergedTime < nextDeploymentTime) {
        changeFailuresByDeployment[deploymentRange]++;
      }
    });
  });

  return changeFailuresByDeployment;
};

export default calculateChangeFailureRate;
