// Custom
import { octokit } from '../constants/octokit';
import { Commit } from '../types';
import { REPO_OWNER } from '../constants/RepoOwner';

interface GraphQLResponse {
    repository: {
        defaultBranchRef: {
            target: {
                history: {
                    nodes: Commit[];
                };
            };
        };
    };
}

const RECENT_COMMITS_QUERY: string = `
  query getRecentCommits($owner: String!, $repo: String!) {
    repository(owner: $owner, name: $repo) {
      defaultBranchRef {
        target {
          ... on Commit {
            history(first: 10) {
              nodes {
                id
                commitUrl
                message
                committedDate
                additions
                deletions
                author {
                  user {
                    login
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`;
// NOTE: This uses GraphQL instead of REST because it supports grabbing additions/deletions and basic commit data in one request.
export const getRecentCommits = async (repo: string): Promise<Commit[]> => {
    const response = await octokit.graphql<GraphQLResponse>(
        RECENT_COMMITS_QUERY,
        {
            owner: REPO_OWNER,
            repo,
        }
    );

    const nodes = response.repository.defaultBranchRef.target.history.nodes;

    return nodes
        .map((commit: Commit) => ({
            id: commit.id,
            committedDate: commit.committedDate,
            commitUrl: commit.commitUrl,
            message: commit.message,
            additions: commit.additions,
            deletions: commit.deletions,
            author: commit.author,
        }))
        .filter((commit) => commit.author?.user?.login === REPO_OWNER); // Filter is done to remove history authored by bots or other contributors
};
