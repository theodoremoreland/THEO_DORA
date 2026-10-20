export const inverseSonarScore = (score: number): number => {
    switch (score) {
        case 1:
            return 5;
        case 2:
            return 4;
        case 4:
            return 2;
        case 5:
            return 1;
        default:
            return score;
    }
};

export const convertSonarScoreToGrade = (
    score: number,
    invert = true
): string => {
    if (invert) {
        switch (score) {
            case 1:
                return 'E';
            case 2:
                return 'D';
            case 3:
                return 'C';
            case 4:
                return 'B';
            case 5:
                return 'A';
            default:
                return 'N/A';
        }
    }

    switch (score) {
        case 1:
            return 'A';
        case 2:
            return 'B';
        case 3:
            return 'C';
        case 4:
            return 'D';
        case 5:
            return 'E';
        default:
            return 'N/A';
    }
};
