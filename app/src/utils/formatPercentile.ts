const formatPercentile = (value: number): string => {
    const num: number = Math.floor(value);

    // Handle exceptions for 11th, 12th, and 13th
    const remainder10 = num % 10;
    const remainder100 = num % 100;

    if (remainder10 === 1 && remainder100 !== 11) {
        return `${num}st`;
    }
    if (remainder10 === 2 && remainder100 !== 12) {
        return `${num}nd`;
    }
    if (remainder10 === 3 && remainder100 !== 13) {
        return `${num}rd`;
    }

    return `${num}th`;
};

export default formatPercentile;
