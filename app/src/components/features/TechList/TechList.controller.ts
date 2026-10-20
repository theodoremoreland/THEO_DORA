// Types
import { TaggedRepoData, TopicCounts } from '../../../types';

// Images
import javascriptIcon from '../../../assets/images/languages/javascript.png';
import pythonIcon from '../../../assets/images/languages/python.png';
import javaIcon from '../../../assets/images/languages/java.png';
import typescriptIcon from '../../../assets/images/languages/typescript.png';
import sqlIcon from '../../../assets/images/languages/sql.png';
import vbaIcon from '../../../assets/images/languages/vba.png';
import rubyIcon from '../../../assets/images/languages/ruby.png';
import htmlIcon from '../../../assets/images/languages/html.png';
import nodeIcon from '../../../assets/images/tools/node.png';
import pandasIcon from '../../../assets/images/tools/pandas.png';
import dockerIcon from '../../../assets/images/tools/docker.png';
import postgresqlIcon from '../../../assets/images/tools/postgresql.png';
import mysqlIcon from '../../../assets/images/tools/mysql.png';
import mongodbIcon from '../../../assets/images/tools/mongodb.png';
import matplotlibIcon from '../../../assets/images/tools/matplotlib.png';
import expressIcon from '../../../assets/images/frameworks/express.png';
import flaskIcon from '../../../assets/images/frameworks/flask.png';
import reactIcon from '../../../assets/images/frameworks/react.png';
import springBootIcon from '../../../assets/images/frameworks/spring-boot.png';
import rubyOnRailsIcon from '../../../assets/images/frameworks/rails.png';
import junitIcon from '../../../assets/images/frameworks/junit.png';
import jestIcon from '../../../assets/images/frameworks/jest.png';
import dataAnalyticsIcon from '../../../assets/images/competencies/data-analytics.png';
import webDevelopmentIcon from '../../../assets/images/competencies/web-development.png';
import dataEngineeringIcon from '../../../assets/images/competencies/data-engineering.png';

const frameworks: { [key: string]: string } = {
    express: 'Express',
    flask: 'Flask',
    react: 'React',
    'spring-boot': 'Spring Boot',
    junit: 'jUnit',
    jest: 'Jest',
    'ruby-on-rails': 'Ruby on Rails',
};
const competencies: { [key: string]: string } = {
    'web-development': 'Web development',
    'data-engineering': 'Data engineering',
    'data-analytics': 'Data analytics',
};
const languages: { [key: string]: string } = {
    python: 'Python',
    javascript: 'JavaScript',
    java: 'Java',
    typescript: 'TypeScript',
    sql: 'SQL',
    vba: 'VBA',
    html: 'HTML',
    ruby: 'Ruby',
};
const tools: { [key: string]: string } = {
    node: 'Node',
    pandas: 'Pandas',
    docker: 'Docker',
    postgresql: 'PostgreSQL',
    mysql: 'MySQL',
    mongodb: 'MongoDB',
    matplotlib: 'Matplotlib',
};

const topicMap: { [key: string]: string } = {
    ...frameworks,
    ...competencies,
    ...languages,
    ...tools,
};

export const findTopicLabel = (topicKey: string) => {
    if (topicMap[topicKey]) return topicMap[topicKey];

    throw new Error('Invalid topic key');
};

export const findKeyForTopicLabel = (topicLabel: string) => {
    let topicKey = null;

    for (const [key, value] of Object.entries(topicMap)) {
        if (value === topicLabel) {
            topicKey = key;

            break;
        }
    }

    if (topicKey) return topicKey;

    throw new Error('Invalid topic label');
};

export const findTopicLabelImageSrc = (topicLabel: string): string => {
    switch (topicLabel) {
        case 'Python':
            return pythonIcon;
        case 'JavaScript':
            return javascriptIcon;
        case 'Java':
            return javaIcon;
        case 'TypeScript':
            return typescriptIcon;
        case 'SQL':
            return sqlIcon;
        case 'VBA':
            return vbaIcon;
        case 'HTML':
            return htmlIcon;
        case 'Node':
            return nodeIcon;
        case 'Pandas':
            return pandasIcon;
        case 'Docker':
            return dockerIcon;
        case 'PostgreSQL':
            return postgresqlIcon;
        case 'MySQL':
            return mysqlIcon;
        case 'MongoDB':
            return mongodbIcon;
        case 'Matplotlib':
            return matplotlibIcon;
        case 'Express':
            return expressIcon;
        case 'Flask':
            return flaskIcon;
        case 'React':
            return reactIcon;
        case 'Spring Boot':
            return springBootIcon;
        case 'jUnit':
            return junitIcon;
        case 'Jest':
            return jestIcon;
        case 'Data analytics':
            return dataAnalyticsIcon;
        case 'Web development':
            return webDevelopmentIcon;
        case 'Data engineering':
            return dataEngineeringIcon;
        case 'Ruby':
            return rubyIcon;
        case 'Ruby on Rails':
            return rubyOnRailsIcon;
        default:
            return '';
    }
};

export const getTopicCounts = (repos: TaggedRepoData[]): TopicCounts => {
    const topicCounts: TopicCounts = {
        frameworks: {},
        competencies: {},
        languages: {},
        tools: {},
    };

    for (const repo of repos) {
        for (const topic of repo.topics) {
            if (frameworks[topic]) {
                topicCounts.frameworks[frameworks[topic]] =
                    (topicCounts.frameworks[frameworks[topic]] || 0) + 1;
            } else if (competencies[topic]) {
                topicCounts.competencies[competencies[topic]] =
                    (topicCounts.competencies[competencies[topic]] || 0) + 1;
            } else if (languages[topic]) {
                topicCounts.languages[languages[topic]] =
                    (topicCounts.languages[languages[topic]] || 0) + 1;
            } else if (tools[topic]) {
                topicCounts.tools[tools[topic]] =
                    (topicCounts.tools[tools[topic]] || 0) + 1;
            }
        }
    }

    return topicCounts;
};

export const determineClassName = (
    topicLabel: string,
    featuredTopics: Set<string>
): 'selected' | undefined => {
    if (featuredTopics.has(findKeyForTopicLabel(topicLabel))) {
        return 'selected';
    }

    return undefined;
};
