interface Bytes {
    [key: string]: number;
}

interface Percentages {
    [key: string]: number;
}

export const convertBytesToPercentages = (data: Bytes): Percentages => {
    const total = Object.values(data).reduce((acc, value) => acc + value, 0);
    const percentages: Percentages = {};

    for (const [key, value] of Object.entries(data)) {
        percentages[key] = total > 0 ? (value / total) * 100 : 0;
    }

    return percentages;
};
