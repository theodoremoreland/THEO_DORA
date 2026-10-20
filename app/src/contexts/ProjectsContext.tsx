import {
    createContext,
    Dispatch,
    SetStateAction,
    ReactElement,
    useCallback,
    useEffect,
    useMemo,
    useState,
} from 'react';

// Third party
import { useQuery } from '@tanstack/react-query';

// Controller
import {
    defaultOrder,
    calculatePairwiseJaccardSimilarity,
} from './ProjectsContext.controller';

// Custom
import { getRepoData } from '../http/getRepoData';
import extractErrorMessage from '../utils/extractErrorMessage';
import backupData from '../assets/data/backup-data.json';

// Types
import { RepoData, TaggedRepoData, PairwiseJaccardSimilarity } from '../types';

interface ProjectsProviderProps {
    children: ReactElement;
}

export const ProjectsContext = createContext({
    repos: undefined as TaggedRepoData[] | undefined,
    updateFeaturedTopics: (() => {}) as (selectedTopic: string) => void,
    selectedProject: null as TaggedRepoData | null,
    setSelectedProject: (() => {}) as Dispatch<
        SetStateAction<TaggedRepoData | null>
    >,
    featuredTopics: new Set<string>(),
    allUniqueTopics: new Set<string>(),
    pairwiseJaccardSimilarity: {} as PairwiseJaccardSimilarity | undefined,
    isError: false,
});

const ProjectsContextProvider = ({
    children,
}: ProjectsProviderProps): ReactElement => {
    const [repos, setRepos] = useState<RepoData[] | undefined>(undefined);
    const [selectedProject, setSelectedProject] =
        useState<TaggedRepoData | null>(null);
    const [pairwiseJaccardSimilarity, setPairwiseJaccardSimilarity] = useState<
        PairwiseJaccardSimilarity | undefined
    >();
    const [allUniqueTopics, setAllUniqueTopics] = useState<Set<string>>(
        new Set()
    );
    const [featuredTopics, setFeaturedTopics] = useState<Set<string>>(
        new Set()
    );
    const taggedRepos: TaggedRepoData[] | undefined = useMemo(() => {
        if (!repos) {
            return;
        }

        return repos.map((repo) => {
            const { topics } = repo;
            const topicsSetRepo = new Set(topics);
            const isEveryFeaturedTopicInRepo: boolean = [
                ...featuredTopics,
            ].every((ft) => topicsSetRepo.has(ft));

            return {
                ...repo,
                isFeatured:
                    featuredTopics.size === 0
                        ? true
                        : isEveryFeaturedTopicInRepo,
            };
        });
    }, [repos, featuredTopics]);

    const { data, isError, error } = useQuery({
        queryKey: ['repos'],
        queryFn: getRepoData,
        staleTime: 240_000,
        retry: false,
    });

    const updateFeaturedTopics = useCallback(
        (selectedTopic: string) => {
            const topicsCopy = featuredTopics
                ? new Set([...featuredTopics])
                : undefined;

            if (!topicsCopy) {
                return;
            }

            if (topicsCopy.has(selectedTopic)) {
                topicsCopy.delete(selectedTopic);
            } else {
                topicsCopy.add(selectedTopic);
            }

            setFeaturedTopics(topicsCopy);
        },
        [featuredTopics]
    );

    useEffect(() => {
        if (data) {
            const orderedProjects: RepoData[] = defaultOrder(data);
            let _pairwise: PairwiseJaccardSimilarity | undefined;

            try {
                _pairwise = calculatePairwiseJaccardSimilarity(orderedProjects);
            } catch (e) {
                const errorMessage: string = extractErrorMessage(e);

                console.log(errorMessage);
            }

            setRepos(orderedProjects);
            setPairwiseJaccardSimilarity(_pairwise);
            setAllUniqueTopics(
                new Set(orderedProjects.flatMap((repo) => repo.topics))
            );
        }
    }, [data]);

    useEffect(() => {
        if (isError) {
            setRepos(backupData);

            console.error(extractErrorMessage(error));
        }
    }, [isError, error]);

    return (
        <ProjectsContext.Provider
            value={{
                repos: taggedRepos,
                updateFeaturedTopics,
                selectedProject,
                setSelectedProject,
                featuredTopics,
                pairwiseJaccardSimilarity,
                allUniqueTopics,
                isError,
            }}
        >
            {children}
        </ProjectsContext.Provider>
    );
};

export default ProjectsContextProvider;
