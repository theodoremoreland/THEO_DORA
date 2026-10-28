import {
    ReactElement,
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
} from 'react';

// Controller
import {
    getTotalDeployments,
    getTotalFeatures,
    getTotalStars,
    getTotalTopics,
    getTopics,
} from './Analytics.controller';

// Components
import InfiniteScroller from '../../features/InfiniteScroller/InfiniteScroller';

// Types
import { TaggedRepoData } from '../../../types';

// Images
import DeploymentIcon from '../../../assets/images/icons/deployed-code.svg?react';
import StarIcon from '../../../assets/images/icons/star.svg?react';
import TopicIcon from '../../../assets/images/icons/topic.svg?react';
import CodeIcon from '../../../assets/images/icons/code.svg?react';

// Styles
import './Analytics.css';

interface Props {
    projects: TaggedRepoData[];
    handleClose: () => void;
}

const Analytics = ({ projects, handleClose }: Props): ReactElement => {
    const topics = useMemo(() => getTopics(projects), [projects]);

    // KPI Refs
    const kpiIncrementIntervalRef = useRef<number | undefined>(undefined);
    const totalFeaturesRef = useRef<number>(getTotalFeatures(projects));
    const totalDeploymentsRef = useRef<number>(getTotalDeployments(projects));
    const totalStarsRef = useRef<number>(getTotalStars(projects));
    const uniqueTopicsCountRef = useRef<number>(getTotalTopics(projects));

    // KPI States
    const [totalDeployments, setTotalDeployments] = useState<number>(0);
    const [totalFeatures, setTotalFeatures] = useState<number>(0);
    const [totalStars, setTotalStars] = useState<number>(0);
    const [uniqueTopicsCount, setUniqueTopicsCount] = useState<number>(0);

    const incrementKpis = useCallback(() => {
        setTotalDeployments((prev) => {
            if (prev < totalDeploymentsRef.current) {
                return prev + 1;
            }

            return prev;
        });
        setTotalFeatures((prev) => {
            if (prev < totalFeaturesRef.current) {
                return prev + 1;
            }

            return prev;
        });
        setTotalStars((prev) => {
            if (prev < totalStarsRef.current) {
                return prev + 1;
            }

            return prev;
        });
        setUniqueTopicsCount((prev) => {
            if (prev < uniqueTopicsCountRef.current) {
                return prev + 1;
            }

            return prev;
        });
    }, []);

    useEffect(() => {
        kpiIncrementIntervalRef.current = window.setInterval(incrementKpis, 5);

        return () => {
            window.clearInterval(kpiIncrementIntervalRef.current);
        };
    }, [incrementKpis]);

    useEffect(() => {
        const areKpiIncrementsComplete =
            totalDeployments === totalDeploymentsRef.current &&
            totalFeatures === totalFeaturesRef.current &&
            totalStars === totalStarsRef.current &&
            uniqueTopicsCount === uniqueTopicsCountRef.current;

        if (areKpiIncrementsComplete) {
            window.clearInterval(kpiIncrementIntervalRef.current);
        }
    }, [totalDeployments, totalFeatures, totalStars, uniqueTopicsCount]);

    return (
        <section id="analytics">
            <nav id="analytics-nav">
                <button
                    type="button"
                    title="Close"
                    className="close-button"
                    onClick={handleClose}
                >
                    Close
                </button>
            </nav>
            <div id="kpis">
                <div
                    id="total-features"
                    className="kpi"
                    title="The total number of projects featured in this web app."
                >
                    <span className="label">Projects featured</span>
                    <span className="value">
                        <CodeIcon className="icon" /> {totalFeatures}
                    </span>
                </div>
                <div
                    id="total-deployments"
                    className="kpi"
                    title="The total number of active web apps across featured projects."
                >
                    <span className="label">Active deployments</span>
                    <span className="value">
                        <DeploymentIcon className="icon" /> {totalDeployments}
                    </span>
                </div>
                <div
                    id="total-stars"
                    className="kpi"
                    title="The total number of stars obtained across featured projects."
                >
                    <span className="label">Stars received</span>
                    <span className="value">
                        <StarIcon className="icon" /> {totalStars}
                    </span>
                </div>
                <div
                    id="total-topics"
                    className="kpi"
                    title="The number of unique GitHub topics present throughout featured projects (e.g. react, python, aws, etc...)."
                >
                    <span className="label">Unique topics</span>
                    <span className="value">
                        <TopicIcon className="icon" />{' '}
                        {uniqueTopicsCount.toLocaleString()}
                    </span>
                </div>
            </div>
            <InfiniteScroller items={topics} />
            <div id="charts" className="row"></div>
        </section>
    );
};

export default Analytics;
