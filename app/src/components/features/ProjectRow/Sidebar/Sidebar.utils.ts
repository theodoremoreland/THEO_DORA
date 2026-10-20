export interface LanguagesByPosition {
    [key: number]: { label: string; percentage: number };
}

export const generateLanguagesByPositionObject = (): LanguagesByPosition => {
    const languagesByPosition: LanguagesByPosition = {};

    for (let i = 0; i < 9; i++) {
        languagesByPosition[i] = {
            label: 'Null',
            percentage: 0,
        };
    }
    return languagesByPosition;
};
