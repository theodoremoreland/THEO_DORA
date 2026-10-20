// React
import { ReactElement, useCallback, useMemo, useState } from 'react';

// Third party
import {
    ChartsAxisData,
    RadarChart,
    useAxesTooltip,
    ChartsTooltipContainer,
} from '@mui/x-charts';
import IconButton from '@mui/material/IconButton';
import { Menu } from '@mui/material';

// Custom
import { convertSonarScoreToGrade, inverseSonarScore } from './utils';
import { REPO_OWNER } from '../../../../constants/RepoOwner';

// Components
import Corner from '../../../common/primitives/Corner/Corner';
import LayeredBar from '../../../common/charts/LayeredBar/LayeredBar';
import GlyphLane from '../../../common/primitives/GlyphLane/GlyphLane';

// Types
import { DoraMetrics, SonarMeasures, TaggedRepoData } from '../../../../types';

// Images
import DeleteHistoryIcon from '../../../../assets/images/icons/delete_history.svg?react';
import EventUpcomingIcon from '../../../../assets/images/icons/event_upcoming.svg?react';
import HourglassArrowUpIcon from '../../../../assets/images/icons/hourglass_arrow_up.svg?react';
import PlannerReviewIcon from '../../../../assets/images/icons/planner_review.svg?react';
import RunningWithErrorsIcon from '../../../../assets/images/icons/running_with_errors.svg?react';
import InfoHollowIcon from '../../../../assets/images/icons/info_filled.svg?react';

// Styles
import './MetricsCard.css';

const CustomToolTip = (): ReactElement | null => {
    const axesTooltip = useAxesTooltip<'radar'>();

    if (!axesTooltip || axesTooltip.length === 0) {
        return null;
    }

    const { seriesItems, axisFormattedValue } = axesTooltip[0];

    return (
        <ChartsTooltipContainer>
            <div className="CustomTooltip">
                {seriesItems.map(
                    ({ formattedLabel, formattedValue, seriesId }) => (
                        <div key={seriesId} className="content">
                            <h4>{axisFormattedValue}</h4>
                            <hr />
                            <p>
                                <span>{formattedLabel}:</span>{' '}
                                <span
                                    className="grade"
                                    data-grade={formattedValue}
                                >
                                    {formattedValue}
                                </span>
                            </p>
                            <p className="note">
                                Click to view on SonarQube Cloud
                            </p>
                        </div>
                    )
                )}
            </div>
        </ChartsTooltipContainer>
    );
};

const SonarCloudBaseUrl: string = `https://sonarcloud.io/project/issues?id=${REPO_OWNER}_`;
const radar = {
    max: 5,
    startAngle: 0,
    metrics: ['Maintainability', 'Reliability', 'Security'],
};
const radarColors: string[] = ['var(--secondary-color)'];
const radarStripeColor = (index: number): string => {
    switch (index) {
        case 0:
            return 'darkred';
        case 1:
            return 'orangered';
        case 2:
            return 'yellow';
        case 3:
            return 'yellowgreen';
        case 4:
            return 'lime';
        default:
            return 'lime';
    }
};
const radarSlotProps = { tooltip: { trigger: 'axis' as const } };
const radarSlots = {
    tooltip: CustomToolTip,
};

interface Props {
    hasSettled: boolean;
    projectData: TaggedRepoData;
    sonarMeasures: SonarMeasures | undefined;
    doraMetrics: DoraMetrics | undefined;
    isSonarMeasuresFetching: boolean;
    isDoraMetricsFetching: boolean;
}

const MetricsCard = ({
    hasSettled,
    projectData,
    sonarMeasures,
    doraMetrics,
    isSonarMeasuresFetching,
    isDoraMetricsFetching,
}: Props): ReactElement => {
    const hasValidDemoLink: boolean =
        projectData.name !== 'ProjectDashboard' && projectData.demo_link !== '';

    const onAxisClick = useCallback(
        (event: MouseEvent, d: ChartsAxisData | null): void => {
            if (event.button === 2) {
                return;
            }

            const SoftwareQualityLink: Record<string, string> = {
                security: `${SonarCloudBaseUrl}${projectData.name}&impactSoftwareQualities=SECURITY&s=IMPACT_RANK`,
                maintainability: `${SonarCloudBaseUrl}${projectData.name}&impactSoftwareQualities=MAINTAINABILITY&s=IMPACT_RANK`,
                reliability: `${SonarCloudBaseUrl}${projectData.name}&impactSoftwareQualities=RELIABILITY&s=IMPACT_RANK`,
            };
            const key = d?.axisValue;

            if (key) {
                const _key = String(key).toLowerCase();

                window.open(SoftwareQualityLink[_key], '_blank');
            }
        },
        [projectData.name]
    );
    const radarData = useMemo(() => {
        return [
            {
                id: 'software-quality',
                label: 'Grade',
                fillArea: true,
                data: [
                    sonarMeasures?.metrics.sqale_rating || 0,
                    sonarMeasures?.metrics.reliability_rating || 0,
                    sonarMeasures?.metrics.security_rating || 0,
                ].map(inverseSonarScore),
                valueFormatter: (value: number) =>
                    convertSonarScoreToGrade(value),
            },
        ];
    }, [sonarMeasures]);
    const topData = useMemo(() => {
        return {
            label: 'Lines of Code*',
            value: sonarMeasures?.metrics.ncloc || 0,
            format: 'int' as const,
            title: '*Lines of application code (does not include dependencies and assets)',
        };
    }, [sonarMeasures]);
    const bottomData = useMemo(() => {
        return {
            label: 'Test Coverage',
            value: sonarMeasures?.metrics.coverage || 0,
            format: 'percent' as const,
            title: 'Percentage of application code covered by automated tests',
        };
    }, [sonarMeasures]);

    return (
        <li className="project-card-container">
            <div className="project-card MetricsCard">
                <Corner position="top-left" />
                <Corner position="bottom-right" />
                <Corner position="top-right" />
                <Corner position="bottom-left" />
                <div
                    className={`software-quality-container ${hasSettled ? 'show' : 'hide'}`}
                >
                    <RadarChart
                        className="RadarChart"
                        desc="A radar chart illustrating code quality grades for project."
                        colors={radarColors}
                        height={220}
                        hideLegend
                        loading={isSonarMeasuresFetching}
                        series={radarData}
                        stripeColor={radarStripeColor}
                        divisions={5}
                        radar={radar}
                        slotProps={radarSlotProps}
                        slots={radarSlots}
                        onAxisClick={onAxisClick}
                    />
                    <LayeredBar
                        className="code-coverage"
                        topData={topData}
                        bottomData={bottomData}
                    />
                </div>
                <div className="middle">
                    <GlyphLane />
                    <MetricsHeader />
                    <GlyphLane />
                </div>
                <ul
                    className={`dora-container ${hasSettled ? 'show' : 'hide'}`}
                >
                    <li title="Lead Time for Changes: Measures elapsed time from the initial commit timestamp to when the PR is merged/deployed">
                        <span className="label-container">
                            <EventUpcomingIcon className="icon" />
                            <p>Lead Time</p>
                        </span>
                        <span className="dots"></span>
                        <p className="metric">{doraMetrics?.leadTime}</p>
                    </li>
                    <li title="Deployment Frequency: Counts total successful production deployments over a specific timeframe">
                        <span className="label-container">
                            <PlannerReviewIcon className="icon" />
                            <p>Frequency</p>
                        </span>
                        <span className="dots"></span>
                        <p className="metric">
                            {doraMetrics?.deploymentFrequency}
                        </p>
                    </li>
                    <li title="Failed Deployment Recovery Time: Time to recover from a failed deployment">
                        <span className="label-container">
                            <HourglassArrowUpIcon className="icon" />
                            <p>Recovery Time</p>
                        </span>
                        <span className="dots"></span>
                        <p className="metric">{doraMetrics?.recoveryTime}</p>
                    </li>
                    <li title="Change Failure Rate: Percentage of total deployments that resulted in a hotfix PR or incident issue">
                        <span className="label-container">
                            <RunningWithErrorsIcon className="icon" />
                            <p>Failure Rate</p>
                        </span>
                        <span className="dots"></span>
                        <p className="metric">
                            {doraMetrics?.changeFailureRate}
                        </p>
                    </li>
                    <li title="Deployment rework rate: Percentage of deployments that are unplanned work to fix bugs">
                        <span className="label-container">
                            <DeleteHistoryIcon className="icon" />
                            <p className="label-container">Rework Rate</p>
                        </span>
                        <span className="dots"></span>
                        <p className="metric">
                            {doraMetrics?.deploymentReworkRate}
                        </p>
                    </li>
                    <div className="deployment-button-container">
                        <a
                            className={`view-deployment-link ${!hasValidDemoLink ? 'disabled' : ''}`}
                            href={
                                hasValidDemoLink
                                    ? projectData.demo_link
                                    : undefined
                            }
                            target="_blank"
                            rel="noopener noreferrer"
                            title={
                                hasValidDemoLink
                                    ? `Click to visit an active deployment of the ${projectData.name} project.`
                                    : undefined
                            }
                        >
                            <button
                                className={`view-deployment ${!hasValidDemoLink ? 'disabled' : ''}`}
                                disabled={!hasValidDemoLink}
                            >
                                <span>View Deployment</span>{' '}
                                {hasValidDemoLink && (
                                    <span className="circle"></span>
                                )}
                            </button>
                        </a>
                    </div>
                </ul>
            </div>
            <div className="trailing-text">
                <p>Metrics</p>
            </div>
        </li>
    );
};

const MetricsHeader = (): ReactElement => {
    // State
    const [
        softwareQualityInfoMenuAnchorEl,
        setSoftwareQualityInfoMenuAnchorEl,
    ] = useState<null | HTMLElement>(null);
    const [doraMetricsInfoMenuAnchorEl, setDoraMetricsInfoMenuAnchorEl] =
        useState<null | HTMLElement>(null);

    // Anchors
    const isSoftwareQualityInfoMenuOpen = Boolean(
        softwareQualityInfoMenuAnchorEl
    );
    const isDoraMetricsInfoMenuOpen = Boolean(doraMetricsInfoMenuAnchorEl);

    // Open
    const handleSoftwareQualityInfoMenuOpen = useCallback(
        (event: React.MouseEvent<HTMLElement>) => {
            setSoftwareQualityInfoMenuAnchorEl(event.currentTarget);
        },
        []
    );
    const handleDoraMetricsInfoMenuOpen = useCallback(
        (event: React.MouseEvent<HTMLElement>) => {
            setDoraMetricsInfoMenuAnchorEl(event.currentTarget);
        },
        []
    );

    // Close
    const handleSoftwareQualityInfoMenuClose = useCallback(() => {
        setSoftwareQualityInfoMenuAnchorEl(null);
    }, []);
    const handleDoraMetricsInfoMenuClose = useCallback(() => {
        setDoraMetricsInfoMenuAnchorEl(null);
    }, []);

    return (
        <div className="MetricsCard__header">
            <h3>
                Software Quality{' '}
                <IconButton
                    id="software-quality-info-menu-icon-button"
                    className="icon-button"
                    aria-label="top-streaks-info-menu"
                    aria-controls={
                        isSoftwareQualityInfoMenuOpen
                            ? 'top-streaks-info-menu'
                            : undefined
                    }
                    aria-haspopup="true"
                    aria-expanded={
                        isSoftwareQualityInfoMenuOpen ? 'true' : undefined
                    }
                    onClick={handleSoftwareQualityInfoMenuOpen}
                >
                    {' '}
                    <InfoHollowIcon className="info-icon" />
                </IconButton>
                <Menu
                    id="top-streaks-info-menu"
                    className="menu"
                    anchorEl={softwareQualityInfoMenuAnchorEl}
                    open={isSoftwareQualityInfoMenuOpen}
                    onClose={handleSoftwareQualityInfoMenuClose}
                >
                    <p>
                        Ratings derived from{' '}
                        <a
                            href="https://docs.sonarsource.com/sonarqube-cloud/standards/managing-rules/rules#software-qualities"
                            target="_blank"
                            referrerPolicy="no-referrer"
                        >
                            SonarQube
                        </a>{' '}
                        code analysis to evaluate software quality.
                    </p>
                </Menu>
            </h3>
            x
            <h3>
                DORA Metrics{' '}
                <IconButton
                    id="dora-metrics-info-menu-icon-button"
                    className="icon-button"
                    aria-label="dora-metrics-info-menu"
                    aria-controls={
                        isDoraMetricsInfoMenuOpen
                            ? 'dora-metrics-info-menu'
                            : undefined
                    }
                    aria-haspopup="true"
                    aria-expanded={
                        isDoraMetricsInfoMenuOpen ? 'true' : undefined
                    }
                    onClick={handleDoraMetricsInfoMenuOpen}
                >
                    <InfoHollowIcon className="info-icon" />
                </IconButton>
                <Menu
                    id="dora-metrics-info-menu"
                    className="menu"
                    anchorEl={doraMetricsInfoMenuAnchorEl}
                    open={isDoraMetricsInfoMenuOpen}
                    onClose={handleDoraMetricsInfoMenuClose}
                >
                    <p>
                        <a
                            href="https://dora.dev/guides/dora-metrics/"
                            target="_blank"
                            referrerPolicy="no-referrer"
                        >
                            A standardized set of performance indicators
                        </a>{' '}
                        used to measure software delivery effectiveness.
                    </p>
                </Menu>
            </h3>
        </div>
    );
};

export default MetricsCard;
