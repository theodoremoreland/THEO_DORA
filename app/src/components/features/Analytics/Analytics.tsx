import {
    ReactElement,
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
} from 'react';

// MUI
import { PieChart } from '@mui/x-charts/PieChart';
import { BarChart } from '@mui/x-charts/BarChart';
import { PieChartSlotProps } from '@mui/x-charts/PieChart';
import { axisClasses } from '@mui/x-charts/ChartsAxis';

// Controller
import {
    getCourseCounts,
    getContextCounts,
    getTotalDeployments,
    getTotalFeatures,
    getTotalStars,
    getTotalTopics,
    getTopTechnologies,
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

const COLORS: string[] = [
    'rgb(23, 58, 94)',
    'rgb(27, 119, 201)',
    'rgb(0, 163, 160)',
    'rgb(39, 39, 39)',
    'rgb(55, 65, 75)',
    'rgb(70, 130, 180)',
    'rgb(0, 191, 255)',
    'rgb(100, 149, 237)',
    'rgb(65, 105, 225)',
    'rgb(60, 179, 113)',
];

interface Props {
    projects: TaggedRepoData[];
    handleClose: () => void;
}

const Analytics = ({ projects, handleClose }: Props): ReactElement => {
    // Get analytics data
    const courseCounts = useMemo(() => getCourseCounts(projects), [projects]);
    const contextCounts = useMemo(() => getContextCounts(projects), [projects]);
    const technologies = useMemo(
        () => getTopTechnologies(projects),
        [projects]
    );
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

    // Pie chart states
    // These states are used to dynamically adjust the pie chart's appearance based on screen size
    const [pieChartMargins, setPieChartMargins] = useState<
        { top: number; right: number; bottom: number; left: number } | undefined
    >(undefined);
    const [pieChartSlotProps, setPieChartSlotProps] =
        useState<PieChartSlotProps>({});
    const [pieChartInnerRadius, setPieChartInnerRadius] = useState<
        number | undefined
    >(undefined);

    const handleResize = useCallback(() => {
        if (window.innerWidth <= 640) {
            const _pieChartSlotProps: PieChartSlotProps = {
                legend: {
                    position: { vertical: 'bottom', horizontal: 'center' },
                    direction: 'horizontal',
                },
            };
            const _pieChartMargins = { top: 0, right: 0, bottom: 110, left: 0 };

            setPieChartInnerRadius(25);
            setPieChartSlotProps(_pieChartSlotProps);
            setPieChartMargins(_pieChartMargins);
        } else if (window.innerWidth < 769) {
            const _pieChartSlotProps: PieChartSlotProps = {
                legend: {
                    position: { vertical: 'bottom', horizontal: 'center' },
                    direction: 'horizontal',
                },
            };
            const _pieChartMargins = { top: 0, right: 0, bottom: 50, left: 0 };

            setPieChartInnerRadius(50);
            setPieChartSlotProps(_pieChartSlotProps);
            setPieChartMargins(_pieChartMargins);
        } else if (window.innerWidth <= 1150) {
            const _pieChartSlotProps: PieChartSlotProps = {
                legend: {
                    position: { vertical: 'middle', horizontal: 'end' },
                    direction: 'vertical',
                },
            };
            const _pieChartMargins = { top: 0, right: 100, bottom: 0, left: 0 };

            setPieChartInnerRadius(55);
            setPieChartSlotProps(_pieChartSlotProps);
            setPieChartMargins(_pieChartMargins);
        } else {
            const _pieChartSlotProps: PieChartSlotProps = {
                legend: {
                    position: { vertical: 'middle', horizontal: 'end' },
                    direction: 'vertical',
                },
            };
            const _pieChartMargins = { top: 0, right: 200, bottom: 0, left: 0 };

            // Quick hack to adjust the inner radius based on screen width
            // Nesting even more if statements within the else block is not ideal,
            // but I don't want to separate logic for the inner radius at this moment.
            if (window.innerWidth >= 1600) {
                setPieChartInnerRadius(88);
            } else {
                setPieChartInnerRadius(58);
            }

            setPieChartSlotProps(_pieChartSlotProps);
            setPieChartMargins(_pieChartMargins);
        }
    }, []);

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

    useEffect(() => {
        window.addEventListener('resize', handleResize);

        handleResize();

        return () => window.removeEventListener('resize', handleResize);
    }, [handleResize]);

    return (
        <section id="analytics">
            <nav id="analytics-nav">
                {/* Putting the onClick handler on the div because
                    the padding on the button wasn't triggering to onClick event.
                    This is a workaround to make the button padding clickable.
                */}
                <div onClick={handleClose}>
                    <button
                        type="button"
                        title="Close"
                        className="close-button"
                    >
                        Close
                    </button>
                </div>
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
            <div id="charts" className="row">
                <div id="pie-charts">
                    <div className="pie-chart-container">
                        <h2 className="pie-chart-title">Projects by context</h2>
                        <PieChart
                            className="Pie"
                            title="Projects by context"
                            colors={COLORS}
                            slotProps={pieChartSlotProps}
                            margin={pieChartMargins}
                            series={[
                                {
                                    data: contextCounts,
                                    highlightScope: {
                                        fade: 'global',
                                        highlight: 'item',
                                    },
                                    innerRadius: pieChartInnerRadius,
                                    paddingAngle: 4,
                                    cornerRadius: 4,
                                    faded: {
                                        innerRadius: 30,
                                        additionalRadius: -30,
                                        color: 'gray',
                                    },
                                },
                            ]}
                        />
                    </div>
                    <div className="pie-chart-container">
                        <h2 className="pie-chart-title">
                            Academic projects by course
                        </h2>
                        <PieChart
                            className="Pie"
                            colors={COLORS}
                            slotProps={pieChartSlotProps}
                            margin={pieChartMargins}
                            series={[
                                {
                                    data: courseCounts,
                                    highlightScope: {
                                        fade: 'global',
                                        highlight: 'item',
                                    },
                                    innerRadius: pieChartInnerRadius,
                                    paddingAngle: 4,
                                    cornerRadius: 4,
                                    faded: {
                                        innerRadius: 30,
                                        additionalRadius: -30,
                                        color: 'gray',
                                    },
                                },
                            ]}
                        />
                    </div>
                </div>
                <div id="bar-chart-container">
                    <h2 className="bar-chart-title">
                        Top 10 technologies used
                    </h2>
                    <BarChart
                        sx={() => ({
                            [`.${axisClasses.root}`]: {
                                [`.${axisClasses.tick}, .${axisClasses.line}`]:
                                    {
                                        stroke: 'white',
                                        strokeWidth: 1,
                                    },
                                [`.${axisClasses.tickLabel}`]: {
                                    fill: 'white',
                                },
                            },
                        })}
                        borderRadius={4}
                        yAxis={[
                            {
                                colorMap: {
                                    type: 'continuous',
                                    min: technologies[technologies.length - 1]
                                        .count,
                                    max: technologies[0].count,
                                    color: [COLORS[2], COLORS[0]],
                                },
                            },
                        ]}
                        dataset={technologies}
                        series={[
                            {
                                dataKey: 'count',
                                label: 'Count of projects using technology',
                            },
                        ]}
                        xAxis={[
                            {
                                scaleType: 'band',
                                dataKey: 'technology',
                            },
                        ]}
                    />
                </div>
            </div>
        </section>
    );
};

export default Analytics;
