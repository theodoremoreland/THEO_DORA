// React
import { ReactElement, useCallback, useEffect, useRef, useMemo } from 'react';

// Third party
import debounce from 'lodash.debounce';

// Custom
import { properCase } from '../../../utils/properCase';
import {
    formatRenderTopic,
    generateValidRandomNumber,
    RenderTopic,
    KATAKANA,
    BUFFER_AMOUNT,
} from './DigitalRain.utils';

// Styles
import './DigitalRain.css';

interface Props {
    topics: string[];
    shouldAnimate: boolean;
    garganta: boolean;
    shouldProperCase?: boolean;
}

const DigitalRain = ({
    topics,
    shouldAnimate,
    garganta,
    shouldProperCase = true,
}: Props): ReactElement => {
    const casedTopics: string[] = useMemo(
        () => (shouldProperCase ? properCase(topics) : topics),
        [topics, shouldProperCase]
    );
    const fontSize: number = garganta ? 16 : 24;

    const canvasRef = useRef<HTMLCanvasElement>(null);
    const animationFrameIdRef = useRef<number | undefined>(undefined);
    const timestampOfLastAnimateRef = useRef<number>(0);
    const activeColumnIndexRef = useRef<number>(15);
    const currentTopicIndexRef = useRef<number>(0);
    const renderingTopicRef = useRef<RenderTopic>(
        formatRenderTopic(casedTopics[0])
    );

    const size = useCallback(() => {
        if (!canvasRef.current) return;

        const dpr: number = window.devicePixelRatio || 1;
        canvasRef.current.width = canvasRef.current.clientWidth * dpr;
        canvasRef.current.height = canvasRef.current.clientHeight * dpr;
    }, []);

    const resize = useCallback(() => debounce(size, 300), [size]);

    useEffect(() => {
        size();

        window.addEventListener('resize', resize);

        return () => window.removeEventListener('resize', resize);
    }, [resize, size]);

    useEffect(() => {
        const canvas = canvasRef.current;

        if (canvas && shouldAnimate) {
            const ctx: CanvasRenderingContext2D | null =
                canvas.getContext('2d');
            const columns: number = canvas.width / fontSize;
            /** Track the vertical 'y' position of each column */
            const columnPositions: number[] = Array.from({
                length: columns,
            }).fill(1) as number[];
            const topicsThatFitCanvas: string[] = casedTopics.filter(
                (topic: string) => {
                    return topic.length * fontSize < canvas.height;
                }
            );

            const draw = (): void => {
                if (!ctx) return;

                const renderingTopic: RenderTopic = renderingTopicRef.current;

                ctx.fillStyle = 'rgba(0, 0, 0, 0.05)'; // Draw a translucent background to create the trailing/fade effect
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                ctx.font = fontSize + 'px custom-regular';

                for (let i = 0; i < columnPositions.length; i++) {
                    const currentRow: number = columnPositions[i];
                    const currentColumn: number = i;
                    const numberOfCharactersLeftToRender: number =
                        renderingTopic.reduce((prev, curr) => {
                            if (!curr.hasRendered) {
                                return prev + 1;
                            } else {
                                return prev;
                            }
                        }, 0);
                    const isBuffering: boolean =
                        numberOfCharactersLeftToRender >
                        renderingTopic.length - BUFFER_AMOUNT;

                    if (
                        activeColumnIndexRef.current === currentColumn &&
                        numberOfCharactersLeftToRender > 0
                    ) {
                        ctx.fillStyle = isBuffering ? '#e2e2e2c0' : '#e2ff04';

                        for (let j = 0; j < renderingTopic.length; j++) {
                            const char = renderingTopic[j];

                            if (char.hasRendered === false) {
                                ctx.fillText(
                                    char.char,
                                    currentColumn * fontSize,
                                    currentRow * fontSize
                                );

                                char.hasRendered = true;

                                break;
                            }
                        }
                    } else {
                        const randomKatakanaCharacter: string =
                            KATAKANA[
                                Math.floor(Math.random() * KATAKANA.length)
                            ];

                        ctx.fillStyle = '#e2e2e2c0';
                        ctx.fillText(
                            randomKatakanaCharacter,
                            currentColumn * fontSize,
                            currentRow * fontSize
                        );
                    }

                    if (
                        currentRow * fontSize > canvas.height &&
                        Math.random() > 0.975
                    ) {
                        // Reset row for current column
                        columnPositions[i] = 0;
                    }

                    if (renderingTopic[renderingTopic.length - 1].hasRendered) {
                        activeColumnIndexRef.current =
                            generateValidRandomNumber(
                                columnPositions.length,
                                activeColumnIndexRef.current
                            );
                        renderingTopicRef.current = formatRenderTopic(
                            topicsThatFitCanvas[currentTopicIndexRef.current]
                        );
                        currentTopicIndexRef.current =
                            currentTopicIndexRef.current ===
                            topicsThatFitCanvas.length - 1
                                ? 0
                                : currentTopicIndexRef.current + 1;
                    }

                    columnPositions[i]++;
                }
            };

            const animate = (time: number) => {
                const delta = time - timestampOfLastAnimateRef.current;

                if (delta >= 80) {
                    draw();
                    timestampOfLastAnimateRef.current = time;
                }

                animationFrameIdRef.current = requestAnimationFrame(animate);
            };

            animationFrameIdRef.current = requestAnimationFrame(animate);
        } else if (!shouldAnimate) {
            if (animationFrameIdRef.current) {
                cancelAnimationFrame(animationFrameIdRef.current);
            }
        }

        return () => {
            if (animationFrameIdRef.current) {
                cancelAnimationFrame(animationFrameIdRef.current);
            }
        };
    }, [shouldAnimate, casedTopics, fontSize]);

    return (
        <div className={`DigitalRainContainer `}>
            <canvas
                ref={canvasRef}
                className={`DigitalRain ${garganta ? 'garganta' : ''}`}
            >
                A The Matrix-style wall of falling text that occasionally reads
                GitHub topics related to this project.
            </canvas>
        </div>
    );
};

export default DigitalRain;
