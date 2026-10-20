export const convertToSonarGrade = (rating: number | undefined): string => {
    switch (rating) {
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
