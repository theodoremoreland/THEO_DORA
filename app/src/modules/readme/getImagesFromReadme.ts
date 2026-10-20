const regexPattern: RegExp = new RegExp(
    '(https:|presentation).*[.](png|PNG)',
    'g'
);

const getImagesFromReadme = (
    readme: string | undefined,
    projectName: string
): string[] => {
    const images: string[] = [];
    let match;

    if (!readme) return [];

    while ((match = regexPattern.exec(readme)) !== null) {
        let imageUrl = match[0];

        if (imageUrl) {
            if (imageUrl.startsWith('presentation')) {
                imageUrl = `https://raw.githubusercontent.com/theodoremoreland/${projectName}/master/${imageUrl}`;
            }

            images.push(imageUrl);
        }
    }

    return images;
};

export default getImagesFromReadme;
