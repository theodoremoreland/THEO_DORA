/**
 * Change failure rate: Number of deployments with AT LEAST ONE issue labeled "incident" or AT LEAST ONE PR labeled "hotfix" or a failed deployment / total deployment runs \* 100
 **Deploy action metadata** and **PRs** and **Issues**
 * @param {*} items
 * @returns
 */
const getChangeFailureRate = (items) => {
  const itemsCount = items.length;
  let totalDifferenceBetweenIncidents = 0;

  if (itemsCount === 0) {
    return null;
  }

  const incidents = items.filter((item) => {
    const isIncident = item.labels.includes("incident");

    return isIncident;
  });

  for (const item of incidents) {
    const createdTime = item.created_timestamp;
    const closedTime = item.closed_timestamp;

    const difference =
      new Date(createdTime).getTime() - new Date(closedTime).getTime();

    totalDifferenceBetweenIncidents += difference;
  }

  return totalDifferenceBetweenIncidents / itemsCount;
};

export default getChangeFailureRate;
