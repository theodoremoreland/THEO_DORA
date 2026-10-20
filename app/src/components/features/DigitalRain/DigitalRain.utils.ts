export type RenderTopic = { char: string; hasRendered: boolean }[];

export const KATAKANA: string[] =
    'ｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜﾝ1234567890'.split('');
export const BUFFER_AMOUNT: number = 3;

/**
 * Generates a random number within a range (intended to avoid generating a random number too close to the edges).
 * @param {number} columnCount - Number of columns.
 * @param {number} previousNumber - Previous random number (ensures new random number)
 * @returns {number} - A random number within a range.
 */
export const generateValidRandomNumber = (
    columnCount: number,
    previousNumber: number
): number => {
    const threshold: number = 10;
    let randomNumber: number = Math.floor(Math.random() * columnCount);

    while (randomNumber === previousNumber) {
        randomNumber = Math.floor(Math.random() * columnCount);
    }

    if (randomNumber > columnCount - threshold) {
        return columnCount - threshold;
    }

    if (randomNumber < threshold) {
        return threshold;
    }

    return randomNumber;
};

const createRenderTopicBuffer = (bufferAmount: number): string => {
    let buffer: string = '';

    for (let i = 0; i < bufferAmount; i++) {
        const randomKatakanaCharacter: string =
            KATAKANA[Math.floor(Math.random() * KATAKANA.length)];

        buffer += randomKatakanaCharacter;
    }

    return buffer;
};

export const formatRenderTopic = (topic: string | undefined): RenderTopic => {
    if (!topic) return [];

    const buffer: string = createRenderTopicBuffer(BUFFER_AMOUNT);

    return `${buffer}${topic}`.split('').map((letter: string) => {
        return {
            char: letter,
            hasRendered: false,
        };
    });
};
