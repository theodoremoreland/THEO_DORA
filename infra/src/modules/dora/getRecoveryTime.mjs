/**
 * Recovery time: average (issue labeled "incident" closed time - issue labeled "incident" created time)
 **Issues**
       id,
      project_id,
      created_timestamp,
      closed_timestamp,
      status,
      labels,
 * @param {*} items
 * @returns
 */
const getRecoveryTime = (issues) => {
  const incidents = issues.filter((item) => {
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

export default getRecoveryTime;
