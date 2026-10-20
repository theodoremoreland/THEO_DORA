// React
import { ReactElement } from 'react';

// Styles
import './Corner.css';

interface Props {
    position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
}

const Corner = ({ position = 'top-left' }: Props): ReactElement => {
    return <div className={`Corner ${position}`}></div>;
};

export default Corner;
