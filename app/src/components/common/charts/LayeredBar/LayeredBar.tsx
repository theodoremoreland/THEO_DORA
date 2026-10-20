// React
import { ReactElement } from 'react';

// Components
import Corner from '../../primitives/Corner/Corner';

// Custom
import { convertToPercentage } from './LayeredBar.utils';

// Styles
import './LayeredBar.css';

type LayerData = {
    label: string;
    value: number;
    format: 'int' | 'percent';
    title?: string;
};

interface Props {
    className: string;
    topData: LayerData;
    bottomData: LayerData;
    direction?: 'vertical' | 'horizontal';
}

const LayeredBar = ({
    className,
    topData,
    bottomData,
}: Props): ReactElement => {
    return (
        <div className={`LayeredBar ${className}`}>
            <div className="top legend">
                <span className="color"></span>
                <div className="label-container">
                    <p title={topData.title}>{topData.label}</p>
                    <hr />
                    <span className="number">
                        <Corner position="top-left" />
                        <Corner position="bottom-right" />
                        <Corner position="top-right" />
                        <Corner position="bottom-left" />
                        {topData.value}
                        {topData.format === 'percent' ? '%' : null}
                    </span>
                </div>
            </div>
            <div className="bar-container">
                <span
                    className="top bar"
                    style={{
                        height: convertToPercentage(topData.value || 0, 10_000),
                    }}
                ></span>
                <span
                    className="bottom bar"
                    style={{
                        height: convertToPercentage(bottomData.value || 0, 100),
                    }}
                ></span>
            </div>
            <div className="bottom legend">
                <span className="color"></span>
                <div className="label-container">
                    <p title={bottomData.title}>{bottomData.label}</p>
                    <hr />
                    <span className="number">
                        <Corner position="top-left" />
                        <Corner position="bottom-right" />
                        <Corner position="top-right" />
                        <Corner position="bottom-left" />
                        {bottomData.value}
                        {bottomData.format === 'percent' ? '%' : null}
                    </span>
                </div>
            </div>
        </div>
    );
};

export default LayeredBar;
