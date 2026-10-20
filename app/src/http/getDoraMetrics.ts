import { DoraMetrics } from '../types';

const SONAR_PROXY_URL = import.meta.env.VITE_SONAR_PROXY_URL;

export const getDoraMetrics = async (
    projectId: string
): Promise<DoraMetrics> => {
    const url = `${SONAR_PROXY_URL}/dora?project_id=${projectId}`;

    const response = await fetch(url, {
        headers: {
            'Content-Type': 'application/json',
        },
    });

    if (!response.ok) {
        throw new Error(`Failed to fetch DORA metrics: ${response.statusText}`);
    }

    const data: DoraMetrics = await response.json();

    return data;
};
