import { ReactElement } from 'react';

import Modal from '../Modal';

interface Props {
    handleClose: () => void;
}

const Overview = ({ handleClose }: Props): ReactElement => {
    return (
        <Modal handleClose={handleClose}>
            <div>
                <article>
                    <h3>Abstract</h3>
                    <p>
                        This web application dynamically renders a list of my{' '}
                        <a
                            target="_blank"
                            rel="noreferrer"
                            href="https://github.com/theodoremoreland?tab=repositories"
                        >
                            GitHub repositories
                        </a>
                        . Repositories are queried in real-time from the{' '}
                        <a
                            target="_blank"
                            rel="noreferrer"
                            href="https://docs.github.com/en/rest"
                        >
                            GitHub API
                        </a>
                        . Each project is configured in a such a way that
                        software quality measures, DORA metrics, commit
                        activity, and views can be viewed from this dashboard.
                    </p>
                    <p>
                        Additionally, metadata concerning project content is
                        accessible directly from this dashboard such as
                        screenshots, video previews, and deployment links.
                    </p>
                </article>
                <article>
                    <h3>SonarQube Quality measures</h3>
                    <ul>
                        <li>
                            <strong>Maintainability:</strong> How easy the code
                            is to understand, change, and keep healthy over
                            time.
                        </li>
                        <li>
                            <strong>Security:</strong> How well the code is
                            protected against vulnerabilities and security
                            weaknesses.
                        </li>
                        <li>
                            <strong>Reliability:</strong> How likely the code is
                            to behave correctly and avoid bugs or failures in
                            production.
                        </li>
                    </ul>
                </article>
                <article>
                    <h3>DORA Metrics</h3>
                    <ul>
                        <li>
                            <strong>Lead Time for Changes:</strong> Measures
                            elapsed time from the initial commit timestamp to
                            when the PR is merged or deployed.
                        </li>
                        <li>
                            <strong>Deployment Frequency:</strong> Counts total
                            successful production deployments over a specific
                            timeframe.
                        </li>
                        <li>
                            <strong>Time to Restore Service:</strong> Measures
                            the time required to recover from a failed
                            deployment.
                        </li>
                        <li>
                            <strong>Change Failure Rate:</strong> Measures the
                            percentage of total deployments that resulted in a
                            hotfix PR or incident issue.
                        </li>
                        <li>
                            <strong>Deployment Rework Rate:</strong>While CFR
                            shows the immediate failure rate of changes,
                            Deployment Rework Rate shows how much work must be
                            done to fix a production issue regardless of whether
                            or not said issue was a deployment failure
                            in-and-of-itself. In other words, 1 failure can
                            cause 6 reworks, and you can have 6 reworks without
                            necessarily causing 1+ deployment failures.
                        </li>
                    </ul>
                </article>
                <article>
                    <h3>Source Code</h3>
                    <p>
                        Learn more about this project by visiting the {''}
                        <a
                            target="_blank"
                            rel="noreferrer"
                            href="https://github.com/theodoremoreland/ProjectDashboard"
                        >
                            repository on GitHub
                        </a>
                        .
                    </p>
                </article>
            </div>
        </Modal>
    );
};

export default Overview;
