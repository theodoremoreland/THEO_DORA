import { SonarMeasures } from '../types';

const INFRA_API_URL = import.meta.env.VITE_INFRA_API_URL;

export const getSonarMeasures = async (
    projectName: string
): Promise<SonarMeasures> => {
    const url = `${INFRA_API_URL}/sonar-measures?project_name=${projectName}`;

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
