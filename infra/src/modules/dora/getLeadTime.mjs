/**
 * - Lead Time for Changes: average (Deploy action timestamp - First commit of PR timestamp labeled "enhancement" or "bugfix")
 **PRs** and **Deploy action metadata**
  created_timestamp,
  closed_timestamp,
  status,
  labels,
 * @param {*} items
 * @returns
 */
const getLeadTime = (items) => {
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

export default getLeadTime;
