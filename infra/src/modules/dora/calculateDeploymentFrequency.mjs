import dayjs from "dayjs";
import weekOfYear from "dayjs/plugin/weekOfYear.js";
import isLeapYear from "dayjs/plugin/isLeapYear.js";
import isoWeeksInYear from "dayjs/plugin/isoWeeksInYear.js";

dayjs.extend(isLeapYear);
dayjs.extend(weekOfYear);
dayjs.extend(isoWeeksInYear);

const today = new Date();
const currentYear = dayjs(today).year();
const currentWeek = dayjs(today).week();

/**
 * Deployment frequency: How frequently the software is successfully deployed on average.
 * @param {{ project_id: number, id: number, target: string, status: string, timestamp: string, workflow_run_id: string}} deployments
 * @returns {number} - Deployment frequency in weeks.
 */
const calculateDeploymentFrequency = (deployments) => {
  const deploymentCountsByWeek = {};
  let totalSuccessfulDeployments = 0;
  let totalWeeks = 0;
  let firstDate;
  let firstWeek;
  let firstYear;

  if (deployments.length === 0) {
    return null;
  }

  const successfulDeployments = deployments.filter(
    (deployment) => deployment.status === "success",
  );

  firstDate = new Date(successfulDeployments[0].timestamp);
  firstYear = dayjs(firstDate).year();
  firstWeek = dayjs(firstDate).week();

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
        // Attempts to start counting weeks at the first deployment
        if (year === firstYear && i < firstWeek) {
          continue;
        }

        weeksObject[i] = 0;

        if (year === currentYear && currentWeek === i) {
          break;
        }
      }

      console.log(deploymentCountsByWeek);
      deploymentCountsByWeek[year] = weeksObject;
    }

    deploymentCountsByWeek[year][week] += 1;
  }

  for (const weeks of Object.values(deploymentCountsByWeek)) {
    for (const deployments of Object.values(weeks)) {
      totalSuccessfulDeployments += deployments;
      totalWeeks += 1;
    }
  }

  if (totalWeeks === 0 || totalSuccessfulDeployments === 0) {
    return null;
  }

  return Number(totalSuccessfulDeployments / totalWeeks).toFixed(2) + "/wk";
};

export default calculateDeploymentFrequency;
