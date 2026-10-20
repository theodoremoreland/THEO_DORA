import { Endpoints } from '@octokit/types';

export enum ProjectType {
    Modernization = 'Modernization',
    Experiment = 'Experiment',
    Practical = 'Practical',
}

export interface RepoData {
    id: number;
    name: string;
    url: string;
    desc: string;
    date_created: string;
    date_updated: string;
    topics: string[];
    image: string;
    demo_link: string;
    readme: string;
    size: number;
    stars: number;
    forks_count: number;
}

export interface TaggedRepoData extends RepoData {
    isFeatured: boolean;
}

export interface PairwiseJaccardSimilarity {
    [projectName: string]: {
        /**
         * How similar is the most similar repo to the selected project.
         * When paired against its closest sibling, there is an N probability that a topic in their combined pool belongs to both repos
         */
        closestMatch: {
            index: number;
            projectName: string;
            likeness: number;
        };
        /**
         * How similar is every repos to the selected project.
         * The exact probability that a topic picked from that combined list belongs to both projects
         */
        jaccardSimilarityStandard: number;
        /**
         * How typical is the selected project compared to all other repos (i.e. typicality percentile)
         */
        jaccardSimilarityNormalized: number;
    };
}

export interface TopicCounts {
    frameworks: { [key: string]: number };
    competencies: { [key: string]: number };
    languages: { [key: string]: number };
    tools: { [key: string]: number };
}

export type View =
    | { isGitHubView: true }
    | { isDemoView: true }
    | { isExploreView: true };

export type ViewCounts = {
    [project_id: string]: {
        last_updated: Date;
        github_views: number;
        demo_views: number;
        explore_views: number;
    };
};

export type SonarMeasures = {
    project_name: string;
    metrics: {
        reliability_rating: number;
        security_rating: number;
        sqale_rating: number;
        coverage: number | undefined;
        ncloc: number;
    };
};

export type DoraMetrics = {
    leadTime: string;
    deploymentFrequency: string;
    deploymentReworkRate: string;
    changeFailureRate: string;
    recoveryTime: string;
};

export interface Commit {
    id: string;
    commitUrl: string;
    message: string;
    committedDate: string;
    additions: number;
    deletions: number;
    author: {
        user: {
            login: string;
        } | null;
    };
}

export type RecentCommitsResponse =
    Endpoints['GET /repos/{owner}/{repo}/commits']['response'];

export type RecentCommitsData =
    Endpoints['GET /repos/{owner}/{repo}/commits']['response']['data'];

export type CommitActivityResponse =
    Endpoints['GET /repos/{owner}/{repo}/stats/commit_activity']['response'];

export type CommitActivityData =
    Endpoints['GET /repos/{owner}/{repo}/stats/commit_activity']['response']['data'];

export type TopLanguagesResponse =
    Endpoints['GET /repos/{owner}/{repo}/languages']['response'];

export type TopLanguagesData =
    Endpoints['GET /repos/{owner}/{repo}/languages']['response']['data'];
