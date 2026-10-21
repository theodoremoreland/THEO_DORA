# THEO_DORA (Work in progress)

This is a work in progress.

## Table of contents

- [Overview](#overview)
  - [Technologies Used](#technologies-used)
  - [DORA Metrics](#dora-metrics)
  - [Software quality measures](#software-quality-measures)
- [Serverless infrastructure](#serverless-infrastructure)

## Overview

This project is an extension of my GitHub profile. It displays a dashboard featuring various data points such as DORA metrics, software quality measures, test coverage, typicality percentiles, and GitHub activity. Additionally, select projects feature screenshots and video previews.

## Technologies Used

- React
- TypeScript
- JavaScript
- HTML
- CSS
- Tanstack React Query
- MUI X Charts
- GitHub Rest API
- GitHub GraphQL
- GitHub Actions
- SonarQube Cloud
- Vite
- Axios
- Docker
- AWS
- AWS Lambda
- AWS DynamoDB
- AWS API Gateway
- AWS SAM

### DORA Metrics

DORA metrics measure the effectiveness and efficiency of a project's software delivery. The can be broken down into two categories: Throughput and Instability.

[DORA Metrics](https://dora.dev/guides/dora-metrics/)

#### Throughput

Throughput is a measure of how many changes can move through the system over a period of time. Higher throughput means that the system can move more changes through to the production environment. DORA uses three factors to measure software delivery throughput:

- Change lead time: The amount of time it takes for a change to go from committed to version control to deployed in production.

- Deployment frequency: The number of deployments over a given period or the time between deployments.

- Failed deployment recovery time: The time it takes to recover from a deployment that fails and requires immediate intervention.

#### Instability

Instability is a measure of how well the software deployments go. When deployments go well, teams can confidently push more changes into production and users are less likely to experience issues with the application immediately following a deployment. DORA uses two factors to measure software delivery instability:

- Change fail rate: The ratio of deployments that require immediate intervention following a deployment. Likely resulting in a rollback of the changes or a “hotfix” to quickly remediate any issues.

- Deployment rework rate: The ratio of deployments that are unplanned but happen as a result of an incident in production.

Taken together, these two factors for software delivery performance (throughput and instability) give teams a high-level understanding of their software delivery performance. Measuring these over time provides insight into how software delivery performance is changing. These factors can be used to measure any application or service, regardless of the technology stack, the complexity of the deployment processes, or its end users.

##### Relationship between CFR and DRR

- **1 failure can cause multiple deployment reworks**
- **Multiple deployment reworks can happen without a single deployment failure**

A **Deployment Failure** (CFR) specifically counts an original planned deployment that broke the system. However, **Deployment Rework** tracks _any_ unplanned deployment made in response to a production bug or incident.

Rework can occur without a corresponding deployment failure in several scenarios:

- **Environmental / Infrastructure Issues:** A third-party API changes, an SSL certificate unexpectedly expires, or cloud database load spikes. The original code deployment was perfectly fine, but you must trigger an **unplanned deployment** (e.g., config update or hotfix) to handle the outage.

- **Discovered Production Bugs (Not tied to a recent release):** A subtle edge-case bug that was deployed 6 months ago suddenly gets triggered by a surge in traffic today. Because it wasn't caused by a recent deployment, it doesn't flag a new Change Failure—yet fixing it requires an **unplanned hotfix deployment** (Rework).

- **User-Reported Data / UI Issues:** A bad data migration or broken UI element is discovered by users on live software. Even if it didn't crash the server or trigger a failed deployment alert, the emergency patch pushed to fix it counts as **Deployment Rework**.

### Software quality measures

### Serverless infrastructure

#### Files and folders

This project contains source code and supporting files for a serverless application that you can deploy with the AWS Serverless Application Model (AWS SAM) command line interface (CLI). It includes the following files and folders:

- `src` - Code for the application's Lambda functions.
  - `__tests__` - Unit tests for the application code.
  - `handlers` - Folder for all of the Lambda event handlers.
- `events` - Invocation events that you can use to invoke the function. Only used to test lambdas locally.
- `env.json.example` - A template for an env.json file that stores variable overrides for the lambdas. Custom variables must be declared in the Globals section of the template.yaml file.
- `template.yaml` - A template that defines the application's AWS resources.
- `seed` - Files for creating tables and rows in PostgreSQL database.

The application uses several AWS resources, including Lambda functions, an API Gateway API, AWS Secrets Manager, and AWS RDS. Only the latter of which is not defined in the `template.yaml` file in this project. You can update the template to add/configure AWS resources through the same deployment process that updates the application code.

#### How the application is deployed

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
  SonarToken=your-sonar-token \
  SonarHost=your-sonar-host
```

The API Gateway endpoint API will be displayed in the outputs when the deployment is complete assuming the API resource is referenced in the Outputs of the `template.yaml`.

#### How the AWS SAM CLI is used to build and test locally

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
```

```bash
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

#### Unit tests

Tests are defined in the `src/__tests__` folder in this project. Use `npm` to install the [Jest test framework](https://jestjs.io/) and run unit tests.

```bash
cd src/
npm install
npm run test
```

#### Cleanup

To delete the sample application that you created, use the AWS CLI. Assuming you used your project name for the stack name, you can run the following:

```bash
sam delete --stack-name theo-dora-infra
```

#### Resources

For an introduction to the AWS SAM specification, the AWS SAM CLI, and serverless application concepts, see the [AWS SAM Developer Guide](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/what-is-sam.html).

#### SAM template notes

Note to self regarding linting errors in VS Code and template.yml files, specifically in reference to !Ref, !Sub, etc...

Environment variables in a Lambda function are defined as a generic dictionary (map) of keys and values. Because it accepts an object, it doesn't care if that object contains a Ref. It passes validation cleanly.

AWS expects developers to reference other APIs frequently inside API Events. Because of this, the official AWS specification specifically defines RestApiId as a mixed type: it can be a plain String OR it can be a Supported Functions Object (like Ref or Fn::ImportValue). Your schema file explicitly has a rule allowing an object there.

This is an oversight/strictness bug in the AWS schema generation for that specific property. The schema for ApiStages defines ApiId strictly as a "type": "string".

When you deploy a SAM template, AWS doesn't name your resources exactly what you call them in the YAML file. To prevent naming conflicts, AWS automatically appends random characters and stack names to the end.
• Your logical resource ProjectEventsApi might end up named my-stack-ProjectEventsApi-1A2B3C4D in the actual AWS console.
• If you hardcode "ProjectEventsApi", AWS won't be able to find it because it doesn't match the auto-generated physical name.

CloudFormation uses Ref to figure out the order in which it needs to build your infrastructure.
• By using a reference, you tell AWS: "Hey, you cannot create this stage until after you finish building the ProjectEventsApi."
• If you use a plain string literal, AWS thinks the resources are completely independent. It will try to build the stage and the API at the exact same time. The stage deployment will fail immediately with a "Resource not found" error because the API doesn't exist yet.

https://docs.aws.amazon.com/AWSCloudFormation/latest/TemplateReference/intrinsic-function-reference.html

Workplace settings:

```json
{
  "yaml.customTags": [
    "!Base64 scalar",
    "!Cidr scalar",
    "!And sequence",
    "!Equals sequence",
    "!If sequence",
    "!Not sequence",
    "!Or sequence",
    "!Condition scalar",
    "!FindInMap sequence",
    "!GetAtt scalar",
    "!GetAtt sequence",
    "!GetAZs scalar",
    "!ImportValue scalar",
    "!Join sequence",
    "!Select sequence",
    "!Split sequence",
    "!Sub scalar",
    "!Transform mapping",
    "!Ref scalar"
  ]
}
```
