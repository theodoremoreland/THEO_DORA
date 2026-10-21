# THEO_DORA (Work in progress)

This is a work in progress.

## Table of contents

- [Overview](#overview)
  - [Technologies Used](#technologies-used)
  - [DORA Metrics](#dora-metrics)
  - [Software quality measures](#software-quality-measures)
- [Serverless infrastructure](#serverless-infrastructure)

## Overview

This project features a dashboard that calculates and displays DORA metrics, software quality measures, test coverage, typicality percentiles, and GitHub activity for my GitHub repositories.

### Technologies Used

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

DORA metrics measure the effectiveness of a project's software delivery. Effectiveness can be broken down into two categories: Throughput and Instability.

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

### Software quality measures

[Software quality measures](https://docs.sonarsource.com/sonarqube-cloud/standards/managing-rules/rules#software-qualities)

High quality code contributes to software that is secure, reliable, and maintainable. SonarQube's software qualities help asses the overall health of your code. These three aspects - security, reliability, and maintainability - are called software qualities in SonarQube and they contribute to the long-term value of your software:

    Security is the protection of your software from unauthorized access, use, or destruction.

    Reliability is a measure of how your software is capable of maintaining its level of performance under stated conditions for a stated period of time.

    Maintainability refers to the ease with which you can repair, improve and understand software code.

Rules are assigned to one or more software qualities based on the answers to these questions:

Is the rule about code that could be exploited by an attacker? If yes, then it’s a security rule.

Is the rule about code that is demonstrably wrong, or more likely wrong than not? If the answer is "yes", then it’s a reliability rule.

Is the rule neither a bug nor a vulnerability? If yes, then it’s a maintainability rule.

### Serverless infrastructure

#### Files and folders

This project contains source code and supporting files for a serverless application that you can deploy with the AWS Serverless Application Model (AWS SAM) command line interface (CLI). It includes the following files and folders:

- `src` - Code for the application's Lambda functions.
  - `__tests__` - Unit tests for the application code.
  - `handlers` - Folder for all of the Lambda event handlers.
- `events` - Invocation events that you can use to invoke the function. Only used to test lambdas locally.
- `env.json.example` - A template for an env.json file that stores variable overrides for the lambdas. Custom variables must be declared in the Globals section of the template.yaml file.
- `template.yaml` - A template that defines the application's AWS resources.

You can update the template to add/configure AWS resources through the same deployment process that updates the application code.

#### How the application is deployed

The AWS SAM CLI is an extension of the AWS CLI that adds functionality for building and testing Lambda applications. It uses Docker to run your functions in an Amazon Linux environment that matches Lambda. It can also emulate your application's build environment and API.

To use the AWS SAM CLI, you need the following tools:

- AWS SAM CLI - [Install the AWS SAM CLI](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/serverless-sam-cli-install.html).
- Node.js - [Install Node.js 22](https://nodejs.org/en/), including the npm package management tool.
- Docker - [Install Docker community edition](https://hub.docker.com/search/?type=edition&offering=community).

To build and deploy application, run the following in your shell:

Deploy with parameter overrides:

```bash
sam deploy \
  --parameter-overrides \
  SonarToken={your-sonar-token} \
  SonarHost={your-sonar-host}
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
sam delete --stack-name {stack-name}
```

#### Resources

For an introduction to the AWS SAM specification, the AWS SAM CLI, and serverless application concepts, see the [AWS SAM Developer Guide](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/what-is-sam.html).

#### SAM template notes

Regarding linting errors in VS Code and template.yml files, specifically in reference to !Ref, !Sub, etc...

https://docs.aws.amazon.com/AWSCloudFormation/latest/TemplateReference/intrinsic-function-reference.html

Add to Workplace settings to remove invalid linting errors for the valuing:

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
