// React
import {
    FC,
    ReactElement,
    useCallback,
    useEffect,
    useRef,
    useState,
    Dispatch,
    SetStateAction,
    MouseEvent,
} from 'react';

// Images
import ArrowUpwardIcon from '../../../../assets/images/icons/arrow_upward.svg?react';

// Styles
import './ImageCarousel.css';

interface Props {
    images: string[];
    selectedImageIndex: number;
    setIsImageCarouselOpen: Dispatch<SetStateAction<boolean>>;
}

const AUTO_PLAY_INTERVAL_TIME: number = 4_000;

const ImageCarousel: FC<Props> = ({
    images,
    selectedImageIndex,
    setIsImageCarouselOpen,
}: Props): ReactElement => {
    const selfRef = useRef<HTMLDivElement>(null);
    const shouldAutoPlay = useRef(true);
    const isAutoPlayPaused = useRef(false);
    const setAutoPlayIntervalId = useRef<number | undefined>(undefined);

    const [currentIndex, setCurrentIndex] = useState(selectedImageIndex);

    const currentImage: string = images[currentIndex];

    const stopAutoPlay = useCallback((): void => {
        if (shouldAutoPlay.current === true) {
            shouldAutoPlay.current = false;
        }

        if (isAutoPlayPaused.current === true) {
            isAutoPlayPaused.current = false;
        }
    }, []);

    const handleBackdropClick = useCallback(
        (event: MouseEvent) => {
            if (event.target === event.currentTarget) {
                setIsImageCarouselOpen(false);
            }
        },
        [setIsImageCarouselOpen]
    );

    const handleLeftClick = () => {
        stopAutoPlay();

        setCurrentIndex((prevIndex) =>
            prevIndex === 0 ? images.length - 1 : prevIndex - 1
        );
    };

    const handleRightClick = () => {
        stopAutoPlay();

        setCurrentIndex((prevIndex) =>
            prevIndex === images.length - 1 ? 0 : prevIndex + 1
        );
    };

    const handleMouseEnter = useCallback(() => {
        if (shouldAutoPlay.current === true) {
            isAutoPlayPaused.current = true;
        }
    }, []);

    const handleMouseLeave = useCallback(() => {
        if (isAutoPlayPaused.current) {
            isAutoPlayPaused.current = false;
        }
    }, []);

    const handleCircleClick = useCallback(
        (index: number) => {
            stopAutoPlay();

            setCurrentIndex(index);
        },
        [stopAutoPlay]
    );

    useEffect(() => {
        const _selfRef = selfRef.current;

        if (images.length < 2) return;

        if (shouldAutoPlay.current) {
            window.clearInterval(setAutoPlayIntervalId.current); // Always clear before setting

            _selfRef?.addEventListener('mouseenter', handleMouseEnter);
            _selfRef?.addEventListener('mouseleave', handleMouseLeave);

            setAutoPlayIntervalId.current = window.setInterval(() => {
                if (
                    shouldAutoPlay.current === true &&
                    isAutoPlayPaused.current === false
                ) {
                    setCurrentIndex((prevIndex) =>
                        prevIndex === images.length - 1 ? 0 : prevIndex + 1
                    );
                } else if (shouldAutoPlay.current === false) {
                    window.clearInterval(setAutoPlayIntervalId.current);
                }
            }, AUTO_PLAY_INTERVAL_TIME);
        }

        return () => {
            window.clearInterval(setAutoPlayIntervalId.current);
            _selfRef?.removeEventListener('mouseenter', handleMouseEnter);
            _selfRef?.removeEventListener('mouseleave', handleMouseLeave);
        };
    }, [images, handleMouseEnter, handleMouseLeave]);

    return (
        <div
            id="clickaway_area__ImageCarousel"
            role="button"
            aria-label="Close image carousel"
            tabIndex={0}
            className="ImageCarousel"
            ref={selfRef}
            onClick={handleBackdropClick}
        >
            <div className="image-container">
                <button className="cycle-button left" onClick={handleLeftClick}>
                    <ArrowUpwardIcon className="icon" />
                </button>
                <img
                    src={currentImage}
                    alt={`Carousel image ${currentIndex + 1}`}
                    onLoad={(e) => {
                        const target: EventTarget = e.target;

                        if (target instanceof HTMLImageElement) {
                            target.classList.add('loaded');
                        }
                    }}
                />
                <button
                    className="cycle-button right"
                    onClick={handleRightClick}
                >
                    <ArrowUpwardIcon className="icon" />
                </button>
                <div className="circles">
                    {images.map((_, index) => (
                        <button
                            key={index}
                            className={`index ${currentIndex === index ? 'selected' : ''}`}
                            onClick={() => handleCircleClick(index)}
                        ></button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ImageCarousel;
