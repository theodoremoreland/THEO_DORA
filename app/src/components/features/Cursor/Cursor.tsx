// React
import { ReactElement, useCallback, useEffect, useRef } from 'react';

// Images
import PointerCursorIcon from '../../../assets/images/icons/pan_tool_alt.svg?react';

// Styles
import './Cursor.css';

interface Props {
    replaceCursor: boolean;
    userId: string;
}

const Cursor = ({ userId, replaceCursor }: Props): ReactElement => {
    const cursorRef = useRef<HTMLDivElement>(null);

    const handleMouseMove = useCallback((event: MouseEvent) => {
        if (!cursorRef.current) return;

        cursorRef.current.style.transform = `translate(${event.clientX}px, ${event.clientY}px) translate(-50%, -50%)`;

        if (event.target instanceof Element) {
            if (event.target.closest('.video')) {
                cursorRef.current.classList.add('video');
            } else {
                cursorRef.current.classList.remove('video');
            }
        }
    }, []);

    useEffect(() => {
        window.addEventListener('mousemove', handleMouseMove);

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
        };
    }, [handleMouseMove]);

    return (
        <div className="Cursor" ref={cursorRef}>
            {replaceCursor && <PointerCursorIcon />}
            <span>#{userId}</span>
        </div>
    );
};

export default Cursor;
