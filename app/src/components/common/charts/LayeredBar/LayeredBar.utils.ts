export const convertToPercentage = (value: number, max: number): number => {
    let result = (value / max) * 100;

    if (result > 100) result = 100;
    else if (result < 0) result = 0;

    return result;
};
