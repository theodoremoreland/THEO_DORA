import { SonarMeasures } from '../types';

const SONAR_PROXY_URL = import.meta.env.VITE_SONAR_PROXY_URL;

export const getSonarMeasures = async (
    projectName: string
): Promise<SonarMeasures> => {
    const url = `${SONAR_PROXY_URL}/sonar-measures?project_name=${projectName}`;

    const response = await fetch(url, {
        headers: {
            'Content-Type': 'application/json',
        },
    });

    if (!response.ok) {
        throw new Error(
            `Failed to fetch Sonar quality measures: ${response.statusText}`
        );
    }

    const data: SonarMeasures = await response.json();

    return data;
};
