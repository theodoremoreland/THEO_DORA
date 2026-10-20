// React
import { ReactElement } from 'react';

// Images
import CommitIcon from '../../assets/images/icons/commit.svg?react';

// Styles
import './GradeGraph.css';

interface Props {
    measure: number | undefined;
    type: 'point' | 'percentage' | 'basic';
}

const convertMeasureToPercent = (
    measure: number | undefined,
    type: 'point' | 'percentage' | 'basic'
): number => {
    let result: number = 0;

    if (!measure) {
        return result;
    }

    switch (type) {
        case 'point':
            result = 100 - (measure - 1) * 20;
            break;
        case 'percentage':
            result = measure;
            break;
        case 'basic':
            result = (measure / 100_000) * 100;
            break;
        default:
            break;
    }

    if (result < 0) result = 0;
    if (result > 100) result = 100;

    return result;
};

const pointSize: number = 16;

const GradeGraph = ({ measure, type }: Props): ReactElement => {
    return (
        <div className="GradeGraph">
            {Array.from({ length: 5 }).map((_, index) => (
                <div key={index} className={`GradeGraph__block`} />
            ))}
            <div className={`GradeGraph__bar`}>
                <CommitIcon
                    className="point"
                    style={{
                        width: `${pointSize}px`,
                        height: `${pointSize}px`,
                        marginLeft: `calc(${convertMeasureToPercent(measure, type)}% - ${pointSize / 2}px)`,
                    }}
                />
            </div>
        </div>
    );
};

export default GradeGraph;
