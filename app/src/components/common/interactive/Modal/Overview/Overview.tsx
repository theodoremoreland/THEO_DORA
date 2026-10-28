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
                        software quality measures, DORA metrics, and commit
                        activity can be viewed from this dashboard.
                    </p>
                    <p>
                        Additionally, project related content is accessible
                        directly from this dashboard such as screenshots, video
                        previews, and deployment links.
                    </p>
                </article>
                <article>
                    <h3>SonarQube Quality measures</h3>
                    <p>
                        SonarQube's software qualities help asses the overall
                        health of code. These three aspects - security,
                        reliability, and maintainability - are called software
                        qualities in SonarQube and they contribute to the
                        long-term value of software. {''}
                        <a
                            target="_blank"
                            rel="noreferrer"
                            href="https://docs.sonarsource.com/sonarqube-cloud/standards/managing-rules/rules#software-qualities"
                        >
                            Learn more SonarQube quality measures
                        </a>
                        .
                    </p>
                </article>
                <article>
                    <h3>DORA Metrics</h3>
                    <p>
                        DORA metrics measure the effectiveness of a project's
                        software delivery. Effectiveness can be broken down into
                        two categories: Throughput and Instability. {''}
                        <a
                            target="_blank"
                            rel="noreferrer"
                            href="https://dora.dev/guides/dora-metrics/"
                        >
                            Learn more about DORA metrics
                        </a>
                        .
                    </p>
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
