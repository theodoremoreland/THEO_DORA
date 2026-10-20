import { DoraMetrics } from '../types';

const INFRA_API_URL = import.meta.env.VITE_INFRA_API_URL;

export const getDoraMetrics = async (
    projectId: string
): Promise<DoraMetrics> => {
    const url = `${INFRA_API_URL}/dora?project_id=${projectId}`;

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
