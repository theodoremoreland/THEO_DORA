# THEO_DORA

<img src="/presentation/thumbnail.webp" width="700">

[View the application](https://project-dashboard.theodoremoreland.dev/)

## Table of contents

- [Overview](#overview)
  - [Technologies Used](#technologies-used)
  - [DORA Metrics](#dora-metrics)
  - [SonarQube Cloud Quality Measures](#sonarqube-cloud-quality-measures)
- [Serverless infrastructure]

Change failure rate = How often a deployment causes an incident or deployment failure
Deployment rework rate = How often are hotfixes deployed

## Overview

DORA metrics, code quality, and metadata for my GitHub projects.

_NOTE: The terms "project" and "repository" are used interchangeably throughout this document._

## Technologies Used

- React
- TypeScript
- JavaScript
- HTML
- CSS
- Tanstack React Query
- MUI X Charts
- GitHub API
- SonarQube
- Vite
- Axios
- Docker
- AWS
- AWS SAM

### DORA Metrics

[DORA Metrics](https://dora.dev/guides/dora-metrics/)

#### Throughput and instability

DORA's software delivery performance metrics focus on a team's ability to deliver software safely, quickly, and efficiently. They can be divided into metrics that show the throughput of software changes, and metrics that show instability of software changes.
Throughput

Throughput is a measure of how many changes can move through the system over a period of time. Higher throughput means that the system can move more changes through to the production environment. DORA uses three factors to measure software delivery throughput:

- Change lead time: The amount of time it takes for a change to go from committed to version control to deployed in production.

- Deployment frequency: The number of deployments over a given period or the time between deployments.

- Failed deployment recovery time: The time it takes to recover from a deployment that fails and requires immediate intervention.

#### Instability

Instability is a measure of how well the software deployments go. When deployments go well, teams can confidently push more changes into production and users are less likely to experience issues with the application immediately following a deployment. DORA uses two factors to measure software delivery instability:

- Change fail rate: The ratio of deployments that require immediate intervention following a deployment. Likely resulting in a rollback of the changes or a “hotfix” to quickly remediate any issues.

- Deployment rework rate: The ratio of deployments that are unplanned but happen as a result of an incident in production.

Taken together, these two factors for software delivery performance (throughput and instability) give teams a high-level understanding of their software delivery performance. Measuring these over time provides insight into how software delivery performance is changing. These factors can be used to measure any application or service, regardless of the technology stack, the complexity of the deployment processes, or its end users.

#### Relationship between CFR and DRR

- **1 failure can cause multiple deployment reworks**
- **Multiple deployment reworks can happen without a single deployment failure**

---

### Why 1 Failure Can Cause Multiple Reworks

A single initial failure or outage in production often requires a multi-step response.

1. **Deployment 1 (Planned Feature):** Causes a memory leak in production. **(1 Change Failure)**
2. **Deployment 2 (Rework):** The team deploys an emergency patch to limit traffic or roll back a specific flag.
3. **Deployment 3 (Rework):** The patch didn't completely solve the memory leak, so they deploy a second follow-up fix.
4. **Deployment 4 (Rework):** A third deployment restores full service after fixing the root cause.

**Result:** $1$ Change Failure resulted in $3$ Deployment Reworks.

---

### Why Deployment Rework Can Happen Without a Deployment Failure

A **Deployment Failure** (CFR) specifically counts an original planned deployment that broke the system. However, **Deployment Rework** tracks _any_ unplanned deployment made in response to a production bug or incident.

Rework can occur without a corresponding deployment failure in several scenarios:

- **Environmental / Infrastructure Issues:** A third-party API changes, an SSL certificate unexpectedly expires, or cloud database load spikes. The original code deployment was perfectly fine, but you must trigger an **unplanned deployment** (e.g., config update or hotfix) to handle the outage.
- **Discovered Production Bugs (Not tied to a recent release):** A subtle edge-case bug that was deployed 6 months ago suddenly gets triggered by a surge in traffic today. Because it wasn't caused by a recent deployment, it doesn't flag a new Change Failure—yet fixing it requires an **unplanned hotfix deployment** (Rework).
- **User-Reported Data / UI Issues:** A bad data migration or broken UI element is discovered by users on live software. Even if it didn't crash the server or trigger a failed deployment alert, the emergency patch pushed to fix it counts as **Deployment Rework**.

### Calculating

Assumptions:

- All PR merged to main trigger "deploy" GitHub action
- Hotfixes are always submitted as a PR labeled "hotfix"
- All production incidents are formally acknowledged once an issue labeled "incident" is created
- Only incidents closed as completed are formally acknowledged as resolved
- All enhancements and non urgent bugfixes will start on their own branch and be merged via PR labeled "enhancement" or "bugfix"

Granted, these assumptions are done for version 1.0 of calculating DORA metrics, which is designed to be a simple and inexpensive as possible without compromising on the core value of DORA.

Formula:

- Lead Time for Changes: average (Deploy action timestamp - First commit of PR timestamp labeled "enhancement" or "bugfix")
  **PRs** and **Deploy action metadata**

- Deployment frequency: average successful "deploy" action runs per week
  **Deploy action metadata**

- Change failure rate: Number of deployments with AT LEAST ONE issue labeled "incident" or AT LEAST ONE PR labeled "hotfix" or a failed deployment / total deployment runs \* 100
  **Deploy action metadata** and **PRs** and **Issues**

- Deployment rework rate: (Number of issues labeled "incidents" closed and PRs labeled "hotfix" submitted) / number of successful deployments \* 100
  **Issues** and **PRs**

- Recovery time: average (issue labeled "incident" closed - issue labeled "incident" created time)
  **Issues**

Data points:

PRs

```raw
- id
- project_id
- merged_timestamp
- first_commit_timestamp
- labels
- submitted_timestamp
- target_branch
```

Deployments

```raw
- id
- project_id
- target
- status
- timestamp
- workflow_run_id
```

Issues

```raw
- id
- project_id
- created_timestamp
- closed_timestamp
- status
- labels
```

### SonarQube Cloud Quality Measures

### Serverless infrastructure

### Files and folders

This project contains source code and supporting files for a serverless application that you can deploy with the AWS Serverless Application Model (AWS SAM) command line interface (CLI). It includes the following files and folders:

- `src` - Code for the application's Lambda functions.
  - `__tests__` - Unit tests for the application code.
  - `handlers` - Folder for all of the Lambda event handlers.
- `events` - Invocation events that you can use to invoke the function. Only used to test lambdas locally.
- `env.json.example` - A template for an env.json file that stores variable overrides for the lambdas. Custom variables must be declared in the Globals section of the template.yaml file.
- `template.yaml` - A template that defines the application's AWS resources.
- `seed` - Files for creating tables and rows in PostgreSQL database.

The application uses several AWS resources, including Lambda functions, an API Gateway API, AWS Secrets Manager, and AWS RDS. Only the latter of which is not defined in the `template.yaml` file in this project. You can update the template to add/configure AWS resources through the same deployment process that updates the application code.

## How the application is deployed

The AWS SAM CLI is an extension of the AWS CLI that adds functionality for building and testing Lambda applications. It uses Docker to run your functions in an Amazon Linux environment that matches Lambda. It can also emulate your application's build environment and API.

To use the AWS SAM CLI, you need the following tools:

- AWS SAM CLI - [Install the AWS SAM CLI](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/serverless-sam-cli-install.html).
- Node.js - [Install Node.js 22](https://nodejs.org/en/), including the npm package management tool.
- Docker - [Install Docker community edition](https://hub.docker.com/search/?type=edition&offering=community).

To build and deploy application for the first time, run the following in your shell:

```bash
sam build
sam deploy --guided
```

Deploy with parameter overrides:

```bash
sam deploy \
  --parameter-overrides \
  DbSecretName=your-secret-name \
  AccessToken=your-access-token
```

The API Gateway endpoint API will be displayed in the outputs when the deployment is complete assuming the API resource is referenced in the Outputs of the `template.yaml`.

## How the AWS SAM CLI is used to build and test locally

Validate template.yaml.

```bash
sam validate --template-file template.yaml
```

Build your application by using the `sam build` command.

```bash
sam build
```

The AWS SAM CLI installs dependencies that are defined in `package.json`, creates a deployment package, and saves it in the `.aws-sam/build` folder.

Test a single function by invoking it directly with a test event. An event is a JSON document that represents the input that the function receives from the event source. Test events are included in the `events` folder in this project.

Run functions locally and invoke them with the `sam local invoke` command.

```bash
sam local invoke {function name} --event events/event-{event name}.json
```

The AWS SAM CLI can also emulate your application's API. Use the `sam local start-api` command to run the API locally on port 3000.

```bash
sam local start-api
curl http://localhost:3000/
```

Start API with environment variable and parameter overrides:

```bash
sam local start-api \
  --env-vars env.json
```

The AWS SAM CLI reads the application template to determine the API's routes and the functions that they invoke. The `Events` property on each function's definition includes the route and method for each path.

```yaml
Events:
  Api:
    Type: Api
    Properties:
      Path: /
      Method: GET
```

## Unit tests

Tests are defined in the `src/__tests__` folder in this project. Use `npm` to install the [Jest test framework](https://jestjs.io/) and run unit tests.

```bash
cd src/
npm install
npm run test
```

## Cleanup

To delete the sample application that you created, use the AWS CLI. Assuming you used your project name for the stack name, you can run the following:

```bash
sam delete --stack-name view-count-api
```

## Resources

For an introduction to the AWS SAM specification, the AWS SAM CLI, and serverless application concepts, see the [AWS SAM Developer Guide](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/what-is-sam.html).
