import { octokit } from '../constants/octokit';
import { REPO_OWNER } from '../constants/RepoOwner';
import { CommitActivityResponse, CommitActivityData } from '../types';

/**
 * In theory, this returns data for 364 days, including today as that can be divided by 52 weeks.
 * It's approximately a year, but naturally doesn't include exactly a year's worth (365 or 366).
 * @param {string} repo - Name of repository
 * @returns {Promise<CommitActivityData>} - Only shows activity authored by the supplied Repo Owner (e.g. commits authored by dependabot won't show)
 */
export const getCommitActivity = async (
    repo: string
): Promise<CommitActivityData> => {
    const response: CommitActivityResponse = await octokit.request(
        'GET /repos/{owner}/{repo}/stats/commit_activity',
        {
            owner: REPO_OWNER,
            repo,
        }
    );

    if (response.status === 202) {
        throw new Error(
            `GitHub is still calculating commit activity for ${repo}. Please try again later.`
        );
    }

    return response.data;
};
