// React
import { SetStateAction, Dispatch, useEffect, useState } from 'react';

// Third party
import { useInView } from 'react-intersection-observer';

// Custom
import {
    useCommitActivity,
    useReadme,
    useRecentCommits,
    useSonarData,
    useDoraMetrics,
    useTopLanguagesData,
} from './ProjectRow.hooks';

// Components
import Sidebar from './Sidebar/Sidebar';
import ThumbnailCard from './Cards/ThumbnailCard';
import MetricsCard from './Cards/MetricsCard';
import ActivityCard from './Cards/ActivityCard';
import Corner from '../../common/primitives/Corner/Corner';

// Types
import { TaggedRepoData } from '../../../types';

// Icons
import ForkRightIcon from '../../../assets/images/icons/fork_right.svg?react';
import HotelClassIcon from '../../../assets/images/icons/hotel_class.svg?react';
import WeightIcon from '../../../assets/images/icons/weight.svg?react';

// Styles
import './ProjectRow.css';

interface Props {
    projectData: TaggedRepoData;
    setSelectedProject: Dispatch<SetStateAction<TaggedRepoData | null>>;
    showDigitalRainAnimation: boolean;
    setShowDigitalRainAnimation: Dispatch<SetStateAction<boolean>>;
}

const ProjectRow = ({ projectData, setSelectedProject }: Props) => {
    const [hasSettled, setHasSettled] = useState<boolean>(false);
    const showBaseContent = hasSettled;

    // Third party hooks
    const { ref, inView } = useInView({
        threshold: 0.25,
    });

    // Custom hooks
    const { topLanguagesData, isTopLanguagesFetching } = useTopLanguagesData(
        projectData.name,
        hasSettled
    );
    const { readmeData, isReadmeFetching } = useReadme(
        projectData.name,
        hasSettled
    );
    const { sonarMeasuresData, isSonarMeasuresFetching } = useSonarData(
        projectData.name,
        hasSettled
    );
    const { doraMetricsData, isDoraMetricsFetching } = useDoraMetrics(
        String(projectData.id),
        hasSettled
    );
    const { commits, isRecentCommitsFetching } = useRecentCommits(
        projectData.name,
        hasSettled
    );
    const { commitActivity, isCommitActivityFetching, isCommitActivityError } =
        useCommitActivity(projectData.name, hasSettled);

    useEffect(() => {
        let timeoutId: number | undefined;

        if (inView) {
            timeoutId = setTimeout(() => {
                setSelectedProject(projectData);
                setHasSettled(projectData.isFeatured);
            }, 250);
        } else {
            setHasSettled(false);
        }

        return () => {
            clearTimeout(timeoutId);
        };
    }, [inView, projectData, setSelectedProject]);

    return (
        <article id={`${projectData.name}`} className={`ProjectRow`} ref={ref}>
            <div
                className={`not-featured-overlay ${projectData.isFeatured ? 'hide' : 'show'}`}
            >
                <div>
                    <h2 className="glitch layers">
                        <span data-text="[Invalid project]">
                            [Invalid project]
                        </span>
                    </h2>
                    <p
                        className="glitch layers"
                        data-text="Project does not satisfy filter criteria"
                    >
                        Project does not satisfy filter criteria
                    </p>
                </div>
            </div>
            <div className="project-row-content">
                <div className="project-row-header">
                    <h2 className="project-name">
                        <Corner position="top-left" />
                        <Corner position="top-right" />
                        {projectData.name}
                        <Corner position="bottom-left" />
                        <Corner position="bottom-right" />
                    </h2>
                    <div className="project-counts">
                        <span className="plus">+</span>
                        <span title="Project size in bytes">
                            <WeightIcon className="weight icon" />
                            {projectData.size}
                        </span>
                        <span className="plus">+</span>
                        <span title="Number of stars">
                            <HotelClassIcon className="query_stats icon" />
                            {projectData.stars}
                        </span>
                        <span className="plus">+</span>
                        <span title="Number of forks">
                            <ForkRightIcon className="fork_right icon" />
                            {projectData.forks_count}
                        </span>
                        <span className="plus">+</span>
                    </div>
                    <div className="meta">
                        <p className="project-date-label">
                            <span>Created</span> x <span>Updated</span>
                        </p>
                        <p className="project-date">
                            C:{' '}
                            {new Date(projectData.date_created).toISOString()}
                        </p>
                        <p className="project-date">
                            U:{' '}
                            {new Date(projectData.date_updated).toISOString()}
                        </p>
                    </div>
                </div>
                <div className="project-row-main">
                    <Sidebar
                        showBaseContent={showBaseContent}
                        languages={topLanguagesData}
                        isTopLanguagesFetching={isTopLanguagesFetching}
                    />
                    <ul className="project-cards">
                        <ThumbnailCard
                            hasSettled={showBaseContent}
                            projectData={projectData}
                            readme={readmeData}
                            isReadmeFetching={isReadmeFetching}
                        />
                        <MetricsCard
                            hasSettled={showBaseContent}
                            projectData={projectData}
                            sonarMeasures={sonarMeasuresData}
                            doraMetrics={doraMetricsData}
                            isSonarMeasuresFetching={isSonarMeasuresFetching}
                            isDoraMetricsFetching={isDoraMetricsFetching}
                        />
                        <ActivityCard
                            hasSettled={showBaseContent}
                            isRecentCommitsFetching={isRecentCommitsFetching}
                            isCommitActivityFetching={isCommitActivityFetching}
                            isCommitActivityError={isCommitActivityError}
                            projectName={projectData.name}
                            commits={commits}
                            commitActivity={commitActivity}
                        />
                    </ul>
                </div>
            </div>
        </article>
    );
};

export default ProjectRow;
