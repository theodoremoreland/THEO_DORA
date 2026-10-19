/**
 * Deployment rework rate: (Number of issues labeled "incidents" closed and PRs labeled "hotfix" submitted) / number of successful deployments \* 100
      **Issues**
      created_timestamp,
      closed_timestamp,
      status,
      labels

      **PRs**
      merged_timestamp,
      first_commit_timestamp,
      labels,
      submitted_timestamp,
      target_branch,
 * @param {*} items
 * @returns
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
