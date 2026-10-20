import { TaggedRepoData } from '../../types';

export const getTopTechnologies = (
    projects: TaggedRepoData[],
    limit: number = 10
): {
    technology: string;
    count: number;
}[] => {
    const topicsToIgnore: string[] = [
        'personal',
        'professional',
        'coursework',
        'exercise',
        'lc101',
        'data-analytics-bootcamp',
        'full-stack-bootcamp',
        'lindenwood-university',
        'web-development',
        'data-engineering',
        'data-analytics',
        'mobile-development',
        'web-scraping',
        'unit-testing',
        'rest-api',
    ];
    const technologies: { [key: string]: number } = {};

    projects.forEach((project: TaggedRepoData) => {
        project.topics.forEach((technology: string) => {
            if (technologies[technology]) {
                technologies[technology] += 1;
            } else {
                technologies[technology] = 1;
            }
        });
    });

    const dataset = Object.entries(technologies)
        .sort((a, b) => b[1] - a[1])
        .filter(([technology]) => !topicsToIgnore.includes(technology))
        .map(([technology, count]) => ({ technology, count }))
        .slice(0, limit);

    return dataset;
};

export const getProjectFileSizes = (projects: TaggedRepoData[]) => {
    let totalSize = 0;

    projects.forEach((project) => {
        totalSize += project.size;
    });

    return totalSize;
};

export const getCourseCounts = (
    projects: TaggedRepoData[]
): { id: number; value: number; label: string }[] => {
    const lc101 = { id: 1, value: 0, label: 'LC101' };
    const dataAnalyticsBootCamp = { id: 2, value: 0, label: 'Wash U Data' };
    const fullStackFlex = { id: 3, value: 0, label: 'SMU Full Stack' };
    // const lindenwoodUniversity = { id: 4, value: 0, label: 'Lindenwood' };
    const other = { id: 4, value: 0, label: 'Other' };

    projects.forEach((project) => {
        if (project.topics.includes('lc101')) {
            lc101.value += 1;
        } else if (project.topics.includes('data-analytics-bootcamp')) {
            dataAnalyticsBootCamp.value += 1;
        } else if (project.topics.includes('full-stack-bootcamp')) {
            fullStackFlex.value += 1;
        } else if (
            project.topics.includes('coursework') ||
            project.topics.includes('exercise')
        ) {
            // If the project is not associated with a course, count it as an academic project
            other.value += 1;
        }
    });

    return [lc101, dataAnalyticsBootCamp, fullStackFlex, other];
};

export const getContextCounts = (
    projects: TaggedRepoData[]
): { id: number; value: number; label: string }[] => {
    const personal = { id: 1, value: 0, label: 'Personal' };
    const professional = { id: 2, value: 0, label: 'Professional' };
    const academic = { id: 3, value: 0, label: 'Academic' };

    projects.forEach((project) => {
        if (project.topics.includes('personal')) {
            personal.value += 1;
        } else if (project.topics.includes('professional')) {
            professional.value += 1;
        } else if (
            project.topics.includes('coursework') ||
            project.topics.includes('exercise')
        ) {
            academic.value += 1;
        }
    });

    return [personal, professional, academic];
};

export const getTotalDeployments = (projects: TaggedRepoData[]): number => {
    let totalDeployments = 0;

    projects.forEach((project) => {
        totalDeployments += project.demo_link ? 1 : 0; // If there is a demo link, count the project as deployed
    });

    return totalDeployments;
};

export const getTotalFeatures = (projects: TaggedRepoData[]): number => {
    let totalFeatures = 0;

    projects.forEach((project) => {
        totalFeatures += project.topics.length > 0 ? 1 : 0;
    });

    return totalFeatures;
};

export const getTotalStars = (projects: TaggedRepoData[]): number => {
    let totalStars = 0;

    projects.forEach((project) => {
        totalStars += project.stars;
    });

    return totalStars;
};

export const getTotalTopics = (projects: TaggedRepoData[]): number => {
    const topics = new Set();

    projects.forEach((project) => {
        project.topics.forEach((topic) => {
            topics.add(topic);
        });
    });

    return topics.size;
};

export const getTopics = (projects: TaggedRepoData[]): string[] => {
    const topics: Set<string> = new Set();

    projects.forEach((project) => {
        project.topics.forEach((topic) => {
            topics.add(topic);
        });
    });

    return [...topics].sort();
};
