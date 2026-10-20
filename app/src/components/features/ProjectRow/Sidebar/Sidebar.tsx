// React
import { ReactElement, useEffect, useState } from 'react';

// Custom
import {
    generateLanguagesByPositionObject,
    LanguagesByPosition,
} from './Sidebar.utils';
import { convertBytesToPercentages } from '../../../../utils/convertBytesToPercentages';

// Styles
import './Sidebar.css';

interface Props {
    languages?: { [key: string]: number };
    isTopLanguagesFetching?: boolean;
}

const Sidebar = ({
    languages,
    isTopLanguagesFetching,
}: Props): ReactElement => {
    const [languagesByPosition, setLanguagesByPosition] =
        useState<LanguagesByPosition>(generateLanguagesByPositionObject());

    useEffect(() => {
        if (languages) {
            const percentages = convertBytesToPercentages(languages);
            const updatedLanguagesByPosition =
                generateLanguagesByPositionObject();

            Object.entries(percentages)
                .sort((a, b) => b[1] - a[1])
                .forEach(([language, percentage], index) => {
                    if (index < 9) {
                        updatedLanguagesByPosition[index] = {
                            label: language,
                            percentage,
                        };
                    }
                });

            setLanguagesByPosition(updatedLanguagesByPosition);
        }
    }, [languages]);

    return (
        <aside className="sidebar">
            <h3 className="sidebar-title">Languages //</h3>
            <ol
                className={`sidebar-list ${isTopLanguagesFetching ? 'fetching' : ''}`}
            >
                {languagesByPosition &&
                    Object.entries(languagesByPosition).map(
                        ([position, { label, percentage }]) => (
                            <li
                                key={position}
                                className={`language-item ${label === 'Null' ? 'redacted' : ''}`}
                            >
                                <span className={`language-label-container`}>
                                    <h3 className={`language-label`}>
                                        {label === 'Null' ? 'Nulll' : label}
                                    </h3>
                                    <p className={`language-percentage`}>
                                        {percentage === 0
                                            ? '-'
                                            : `${percentage.toFixed(2)}%`}
                                    </p>
                                </span>
                                <div className="language-level-container">
                                    <span
                                        className="language-level"
                                        style={{
                                            width: `${percentage.toFixed(2)}%`,
                                        }}
                                    ></span>
                                </div>
                            </li>
                        )
                    )}
            </ol>
        </aside>
    );
};

export default Sidebar;
