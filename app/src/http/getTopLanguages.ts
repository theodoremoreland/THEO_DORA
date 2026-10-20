// Custom
import { octokit } from '../constants/octokit';
import { TopLanguagesData, TopLanguagesResponse } from '../types';
import { REPO_OWNER } from '../constants/RepoOwner';

export const getTopLanguages = async (
    repo: string
): Promise<TopLanguagesData> => {
    const response: TopLanguagesResponse = await octokit.request(
        `GET /repos/{owner}/{repo}/languages`,
        {
            owner: REPO_OWNER,
            repo,
            headers: {
                'X-GitHub-Api-Version': '2026-03-10',
            },
        }
    );

    return response.data;
};
