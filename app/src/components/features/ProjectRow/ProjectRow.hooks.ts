// React
import { useEffect, useState } from 'react';

// Third party
import { useQuery } from '@tanstack/react-query';

// Custom
import extractErrorMessage from '../../../utils/extractErrorMessage';
import { getTopLanguages } from '../../../http/getTopLanguages';
import { getSonarMeasures } from '../../../http/getSonarMeasures';
import { getRecentCommits } from '../../../http/getRecentCommits';
import { getCommitActivity } from '../../../http/getCommitActivity';
import { getProjectReadme } from '../../../modules/readme/';

// Types
import { Commit } from '../../../types';
import { getDoraMetrics } from '../../../http/getDoraMetrics';

export const useTopLanguagesData = (projectName: string, enabled: boolean) => {
    const {
        data: topLanguagesData,
        isFetching: isTopLanguagesFetching,
        isError: isTopLanguagesError,
        error: topLanguagesError,
    } = useQuery({
        enabled: enabled,
        queryKey: ['topLanguages', projectName],
        queryFn: () => getTopLanguages(projectName),
        staleTime: Infinity,
        retry: false,
    });

    useEffect(() => {
        if (isTopLanguagesError) {
            console.error(extractErrorMessage(topLanguagesError));
        }
    }, [isTopLanguagesError, topLanguagesError]);

    return {
        topLanguagesData,
        isTopLanguagesFetching,
        isTopLanguagesError,
        topLanguagesError,
    };
};

export const useReadme = (projectName: string, enabled: boolean) => {
    const {
        data: readmeData,
        error: readmeError,
        isError: isReadmeError,
        isFetching: isReadmeFetching,
    } = useQuery({
        enabled: enabled,
        queryKey: ['readme', projectName],
        queryFn: () => getProjectReadme(projectName),
        staleTime: Infinity,
        retry: false,
    });

    useEffect(() => {
        if (isReadmeError) {
            console.error(`Failed to fetch README.md ${readmeError}`);
        }
    }, [isReadmeError, readmeError]);

    return {
        readmeData,
        readmeError,
        isReadmeError,
        isReadmeFetching,
    };
};

export const useSonarData = (projectName: string, enabled: boolean) => {
    const {
        data: sonarMeasuresData,
        error: sonarMeasuresError,
        isError: isSonarMeasuresError,
        isFetching: isSonarMeasuresFetching,
    } = useQuery({
        enabled: enabled,
        queryKey: ['sonarMeasures', projectName],
        queryFn: () => getSonarMeasures(projectName),
        staleTime: Infinity,
        retry: false,
    });

    useEffect(() => {
        if (isSonarMeasuresError) {
            console.error(
                `Failed to fetch Sonar measures ${sonarMeasuresError}`
            );
        }
    }, [isSonarMeasuresError, sonarMeasuresError]);

    return {
        sonarMeasuresData,
        sonarMeasuresError,
        isSonarMeasuresError,
        isSonarMeasuresFetching,
    };
};

export const useDoraMetrics = (projectId: string, enabled: boolean) => {
    const {
        data: doraMetricsData,
        error: doraMetricsError,
        isError: isDoraMetricsError,
        isFetching: isDoraMetricsFetching,
    } = useQuery({
        enabled: enabled,
        queryKey: ['doraMetrics', projectId],
        queryFn: () => getDoraMetrics(projectId),
        staleTime: Infinity,
        retry: false,
    });

    useEffect(() => {
        if (isDoraMetricsError) {
            console.error(`Failed to fetch Sonar measures ${doraMetricsError}`);
        }
    }, [isDoraMetricsError, doraMetricsError]);

    return {
        doraMetricsData,
        doraMetricsError,
        isDoraMetricsError,
        isDoraMetricsFetching,
    };
};

export const useRecentCommits = (projectName: string, enabled: boolean) => {
    const [commits, setCommits] = useState<Commit[] | undefined>(undefined);

    const {
        data: recentCommitsData,
        isError: isRecentCommitsError,
        isFetching: isRecentCommitsFetching,
        error: recentCommitsError,
    } = useQuery({
        enabled: enabled,
        queryKey: ['commits', projectName],
        queryFn: () => getRecentCommits(projectName),
        staleTime: Infinity,
        retry: false,
    });

    useEffect(() => {
        if (recentCommitsData) {
            setCommits(recentCommitsData);
        }
    }, [recentCommitsData]);

    useEffect(() => {
        if (isRecentCommitsError) {
            setCommits([]);

            console.error(extractErrorMessage(recentCommitsError));
        }
    }, [isRecentCommitsError, recentCommitsError]);

    return {
        commits,
        isRecentCommitsError,
        isRecentCommitsFetching,
        recentCommitsError,
    };
};

export const useCommitActivity = (projectName: string, enabled: boolean) => {
    const {
        data: commitActivityData,
        isError: isCommitActivityError,
        isFetching: isCommitActivityFetching,
        error: commitActivityError,
    } = useQuery({
        enabled: enabled,
        queryKey: ['commitActivity', projectName],
        queryFn: () => getCommitActivity(projectName),
        staleTime: Infinity,
        retry: 4,
        retryDelay: 1500,
    });

    useEffect(() => {
        if (isCommitActivityError) {
            console.error(
                `Failed to fetch commit activity: ${commitActivityError}`
            );
        }
    }, [isCommitActivityError, commitActivityError]);

    return {
        commitActivity: commitActivityData,
        isCommitActivityError,
        isCommitActivityFetching,
        commitActivityError,
    };
};
