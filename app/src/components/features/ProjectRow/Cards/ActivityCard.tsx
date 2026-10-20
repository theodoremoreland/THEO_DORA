// React
import { ReactElement, useCallback, useMemo } from 'react';

// Third party
import {
    BarChart,
    SparkLineChart,
    useItemTooltip,
    useAxesTooltip,
    ChartsTooltipContainer,
} from '@mui/x-charts';

// Custom
import {
    DayCommits,
    getCommitsPerDay,
    getRecentDelta,
} from './ActivityCard.utils';
import { REPO_OWNER } from '../../../../constants/RepoOwner';

// Components
import Corner from '../../../common/primitives/Corner/Corner';
import GlyphLane from '../../../common/primitives/GlyphLane/GlyphLane';

// Types
import { CommitActivityData, Commit } from '../../../../types';

// Styles
import './ActivityCard.css';

const CustomDeltaBarToolTip = (): ReactElement | null => {
    const itemsTooltip = useItemTooltip<'bar'>();

    if (!itemsTooltip) {
        return null;
    }

    const { identifier, formattedValue } = itemsTooltip;

    const label: string =
        identifier.dataIndex === 0 ? 'Lines added' : 'Lines deleted';

    return (
        <ChartsTooltipContainer>
            <div className="CustomTooltip">
                <div key={identifier.seriesId} className="content">
                    <h4>{label}</h4>
                    <p className="note">In the last 10 commits</p>
                    <hr />
                    <p className="value" data-index={identifier.dataIndex}>
                        {identifier.dataIndex === 0 ? `+` : null}
                        {formattedValue}
                    </p>
                    <p className="note">*Includes dependencies and assets</p>
                </div>
            </div>
        </ChartsTooltipContainer>
    );
};

const CustomSparklineToolTip = (): ReactElement | null => {
    // The tooltip only works with axes hook for sparkline in my experience
    const axesTooltip = useAxesTooltip<'line'>();

    if (!axesTooltip || axesTooltip.length === 0) {
        return null;
    }

    const { axisFormattedValue, seriesItems } = axesTooltip[0];

    return (
        <ChartsTooltipContainer>
            <div className="CustomTooltip">
                <div className="content">
                    <h4>{axisFormattedValue} UTC</h4>
                    <hr />
                    <p className="value">
                        {seriesItems[0]?.formattedValue} commits
                    </p>
                    <p className="note">Click to view history</p>
                </div>
            </div>
        </ChartsTooltipContainer>
    );
};

const barX = [
    {
        id: 'x-axis-1',
        scaleType: 'band' as const,
        data: ['Additions', 'Deletions'] as const,
    },
];
const barY = [
    {
        id: 'y-axis-1',
        label: 'Lines of code*',
        colorMap: {
            type: 'piecewise' as const,
            thresholds: [0],
            colors: ['darkred', 'lime'],
        },
    },
];
const barGrid = { horizontal: true, vertical: true };
const barSlots = { tooltip: CustomDeltaBarToolTip };
const sparklineSlots = { tooltip: CustomSparklineToolTip };

interface Props {
    hasSettled: boolean;
    projectName: string;
    commits: Commit[] | undefined;
    commitActivity: CommitActivityData | undefined;
    isRecentCommitsFetching?: boolean;
    isCommitActivityFetching?: boolean;
}

const ActivityCard = ({
    hasSettled,
    commits,
    commitActivity,
    projectName,
    isRecentCommitsFetching,
    isCommitActivityFetching,
}: Props): ReactElement => {
    const commitsByDay: DayCommits[] = useMemo(
        () => getCommitsPerDay(commitActivity),
        [commitActivity]
    );
    const recentDelta: [number, number] = useMemo(
        () => getRecentDelta(commits),
        [commits]
    );
    const barSeries = useMemo(
        () => [
            {
                id: 'activity-delta-series',
                data: recentDelta,
                barLabel: 'value' as const,
            },
        ],
        [recentDelta]
    );
    const sparklineX = useMemo(() => {
        return {
            id: 'days',
            type: 'time' as const,
            data: commitsByDay.map((dayCommits) => dayCommits.date),
            valueFormatter: (value: Date) => value.toLocaleDateString(),
        };
    }, [commitsByDay]);
    const sparklineData = useMemo(() => {
        return commitsByDay.map((dayCommits) => dayCommits.commitCount);
    }, [commitsByDay]);
    const onSparklineClick = useCallback((): void => {
        window.open(
            `https://github.com/${REPO_OWNER}/${projectName}/activity?ref=main&actor=${REPO_OWNER}&time_period=year`,
            '_blank'
        );
    }, [projectName]);

    return (
        <li className="project-card-container">
            <div className="project-card ActivityCard">
                <Corner position="top-left" />
                <Corner position="bottom-right" />
                <Corner position="top-right" />
                <Corner position="bottom-left" />
                <div className="top">
                    <BarChart
                        className={`DeltaBarChart ${hasSettled ? 'show' : 'hide'}`}
                        height={270}
                        xAxis={barX}
                        yAxis={barY}
                        series={barSeries}
                        grid={barGrid}
                        slots={barSlots}
                    />
                </div>
                <div className="middle">
                    <GlyphLane />
                    <div
                        className={`sparkline-container ${isCommitActivityFetching || sparklineData.length === 0 ? '' : 'loaded'}`}
                    >
                        <h4 className="label">Commit activity</h4>
                        <SparkLineChart
                            data={sparklineData}
                            xAxis={sparklineX}
                            slots={sparklineSlots}
                            color="var(--secondary-color)"
                            height={35}
                            onClick={onSparklineClick}
                            showTooltip
                            showHighlight
                        />
                    </div>
                    <GlyphLane />
                </div>
                <div className="bottom">
                    <div
                        className={`commits-container ${hasSettled ? 'show' : 'hide'}`}
                    >
                        <h3>Last 10 commits</h3>
                        <ul className="commits">
                            {isRecentCommitsFetching && (
                                <p>Loading commits...</p>
                            )}
                            {commits?.map((commit, index) => {
                                const l = new Date(commit.committedDate);

                                return (
                                    <li key={index} className="commit">
                                        <h4>{commit.message}</h4>
                                        <p>
                                            {commit.committedDate
                                                ? l.toLocaleString()
                                                : 'Unknown date'}
                                        </p>
                                        <a
                                            target="_blank"
                                            rel="noreferrer"
                                            href={commit.commitUrl}
                                        >
                                            View code diff on GitHub
                                        </a>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                </div>
            </div>
            <div className="trailing-text">
                <p>Activity</p>
            </div>
        </li>
    );
};

export default ActivityCard;
