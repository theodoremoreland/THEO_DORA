import { TaggedRepoData } from '../types';

export enum ProjectContext {
    Practical = 'Practical',
    Experiment = 'Experiment',
    Modernization = 'Modernization',
}

const hasTopic = (
    projectData: TaggedRepoData,
    searchTopic: string
): boolean => {
    return projectData.topics?.some((topic) => topic === searchTopic);
};

const getProjectContext = (projectData: TaggedRepoData): ProjectContext[] => {
    const projectContexts: ProjectContext[] = [];

    if (hasTopic(projectData, 'practical')) {
        projectContexts.push(ProjectContext.Practical);
    }

    if (hasTopic(projectData, 'experiment')) {
        projectContexts.push(ProjectContext.Experiment);
    }

    if (hasTopic(projectData, 'modernization')) {
        projectContexts.push(ProjectContext.Modernization);
    }

    return projectContexts;
};

export default getProjectContext;
