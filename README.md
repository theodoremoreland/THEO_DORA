# THEO_DORA

<img src="/presentation/thumbnail.webp" width="700">

[View the application](https://project-dashboard.theodoremoreland.dev/)

## Table of contents

- [Overview](#overview)
  - [DORA Metrics](#dora-metrics)
- [Technologies Used](#technologies-used)

Change failure rate = How often a deployment causes an incident or deployment failure
Deployment rework rate = How often are hotfixes deployed

## Overview

DORA metrics, code quality, and metadata for my GitHub projects.

_NOTE: The terms "project" and "repository" are used interchangeably throughout this document._

### DORA Metrics

https://dora.dev/guides/dora-metrics/

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
- merged_timestamp
- first_commit_timestamp
- labels
- submitted_timestamp
- target_branch
```

Deployments

```raw
- id
- target
- status
- timestamp
- workflow_run_id
```

Issues

```raw
- id
- created_timestamp
- closed_timestamp
- status
- labels
```

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
