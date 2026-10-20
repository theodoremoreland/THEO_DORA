import { CommitActivityData, Commit } from '../../../types';

export type DayCommits = {
    date: Date;
    commitCount: number;
};

/**
 * NOTE: The "week" returned from github request is the start of the week as a Unix timestamp
 * (measured in seconds since January 1, 1970), typically aligned to Sunday
 * multiplying it by 1000 milliseconds gets us the date when passed as argument to new Date constructor.
 * @param {CommitActivityData} commitActivity - GitHub commit activity
 * @returns an array where each element is the number of commits for a given day.
 * The array features a count for each day of the past year (starting from yesterday).
 * In total, there should be between 364-365 elements.
 */
export const getCommitsPerDay = (
    commitActivity: CommitActivityData | undefined
): DayCommits[] => {
    if (!commitActivity) {
        return [];
    }

    const result: {
        date: Date;
        commitCount: number;
    }[] = [];

    commitActivity
        .sort((a, b) => (a.week || 0) - (b.week || 0))
        .forEach((weekActivity) => {
            weekActivity.days.forEach((day, index) => {
                const commitDate: Date = new Date(
                    weekActivity.week * 1_000 + 1000 * 60 * 60 * 24 * index
                );

                result.push({
                    date: commitDate,
                    commitCount: day,
                });
            });
        });

    return result;
};

export const getRecentDelta = (
    commits: Commit[] | undefined
): [number, number] => {
    if (!commits) {
        return [0, 0];
    }

    const additions: number = commits.reduce(
        (prev, curr) => prev + curr.additions,
        0
    );
    const deletions: number = commits.reduce(
        (prev, curr) => prev + curr.deletions,
        0
    );

    return [additions, -deletions];
};
