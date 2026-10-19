import dayjs from "dayjs";
import weekOfYear from "dayjs/plugin/weekOfYear";
import isLeapYear from "dayjs/plugin/isLeapYear";
import isoWeeksInYear from "dayjs/plugin/isoWeeksInYear";

dayjs.extend(isLeapYear);
dayjs.extend(weekOfYear);
dayjs.extend(isoWeeksInYear);

const today = new Date();
const currentYear = dayjs(today).year();
const currentWeek = dayjs(today).week();

/**
 * Deployment frequency: average successful "deploy" action runs per week
 *    project_id,
      event_type_and_timestamp,
      id,
      target,
      status,
      timestamp: timestampISO,
      workflow_run_id,

 */
const getDeploymentFrequency = (items) => {
  const deploymentCountsByWeek = {};
  let totalDeployments = 0;
  let totalWeeks = 0;

  if (items.length === 0) {
    return 0;
  }

  const successfulDeployments = items.filter(
    (deployment) => deployment.status === "success",
  );

  for (const item of successfulDeployments) {
    const timestamp = item.timestamp;
    const date = new Date(timestamp);
    const djs = dayjs(date);
    const year = djs.year();
    const week = djs.week();

    if (deploymentCountsByWeek[year] === undefined) {
      const numberOfWeeksInYear = dayjs(`${year}-01-01`).isoWeeksInYear();
      let weeksObject = {};

      for (let i = 1; i < numberOfWeeksInYear + 1; i++) {
        weeksObject[i] = 0;

        if (year === currentYear && currentWeek === i) {
          break;
        }
      }

      deploymentCountsByWeek[year] = weeksObject;
    }

    deploymentCountsByWeek[year][week] += 1;
  }

  for (const [year, weeks] of Object.entries(deploymentCountsByWeek)) {
    console.log(year);

    for (const deployments of Object.values(weeks)) {
      totalDeployments += deployments;
      totalWeeks += 1;
    }
  }

  if (totalWeeks === 0 || totalDeployments === 0) {
    return 0;
  }

  return Number(totalDeployments / totalWeeks).toFixed(2);
};

export default getDeploymentFrequency;
