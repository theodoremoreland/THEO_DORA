/**
 * Recovery time: average (issue labeled "incident" closed time - issue labeled "incident" created time)
 * @param {{id: number, project_id: number, created_timestamp: string, closed_timestamp: string, status: string, labels: string[]}[]} issues
 * @returns {number} -
 */
const calculateRecoveryTime = (issues) => {
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

export default calculateRecoveryTime;
