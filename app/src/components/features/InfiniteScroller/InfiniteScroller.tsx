// React
import { ReactElement, useRef } from 'react';

// Images
import HighlightMouseCursorIcon from '../../../assets/images/icons/highlight_mouse_cursor.svg?react';

// Styles
import './InfiniteScroller.css';

interface Props {
    items: (string | number)[];
}

const InfiniteScroller = ({ items }: Props): ReactElement => {
    const halfwayPoint: number = Math.floor(items.length / 2);
    const firstHalf_Repeated: (string | number)[] = [
        ...items.slice(0, halfwayPoint),
        ...items.slice(0, halfwayPoint),
    ];
    const secondHalf_Repeated: (string | number)[] = [
        ...items.slice(halfwayPoint),
        ...items.slice(halfwayPoint),
    ];

    const hoverIndicatorContainer = useRef<HTMLDivElement>(null);
    const leftLane = useRef<HTMLUListElement>(null);
    const rightLane = useRef<HTMLUListElement>(null);

    const activateLanes = (): void => {
        if (hoverIndicatorContainer.current) {
            hoverIndicatorContainer.current.classList.add('active');
        }
        if (leftLane.current) {
            leftLane.current.classList.add('active');
        }
        if (rightLane.current) {
            rightLane.current.classList.add('active');
        }
    };

    const deactivateLanes = (): void => {
        if (hoverIndicatorContainer.current) {
            hoverIndicatorContainer.current.classList.remove('active');
        }
        if (leftLane.current) {
            leftLane.current.classList.remove('active');
        }
        if (rightLane.current) {
            rightLane.current.classList.remove('active');
        }
    };

    return (
        <div className="InfiniteScroller">
            <div
                ref={hoverIndicatorContainer}
                className="hover-indicator-container"
                onMouseEnter={activateLanes}
                onMouseLeave={deactivateLanes}
                onTouchStart={activateLanes}
                onTouchEnd={deactivateLanes}
            >
                <HighlightMouseCursorIcon className="hover-indicator" />
            </div>
            <ul ref={leftLane} className="lane left">
                {firstHalf_Repeated.map((item, index) => (
                    <li key={`${item}-${index}`} className="item topic">
                        {item}
                    </li>
                ))}
            </ul>
            <ul ref={rightLane} className="lane right">
                {secondHalf_Repeated.map((item, index) => (
                    <li key={`${item}-${index}`} className="item topic">
                        {item}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default InfiniteScroller;
