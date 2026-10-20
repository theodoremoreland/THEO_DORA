// React
import { ReactElement, useMemo, useState } from 'react';

import {
    findKeyForTopicLabel,
    findTopicLabelImageSrc,
    determineClassName,
} from './TechList.controller';

// Types
import { TaggedRepoData } from '../../../types';

// Images
import KeyboardControlKey from '../../../assets/images/icons/keyboard_control_key.svg?react';
import CheckIcon from '../../../assets/images/icons/check.svg?react';

interface Props {
    groupName: string;
    repos: TaggedRepoData[];
    topics: {
        [key: string]: number;
    };
    featuredTopics: Set<string>;
    updateFeaturedTopics: (selectedTopic: string) => void;
}

const ListItems = ({
    groupName,
    repos,
    topics,
    featuredTopics,
    updateFeaturedTopics,
}: Props): ReactElement => {
    const sortedTopics: [string, number][] = useMemo(() => {
        return Object.entries(topics).sort(
            ([, topicCount1], [, topicCount2]) => topicCount2 - topicCount1
        );
    }, [topics]);

    const [isGroupVisible, setIsGroupVisible] = useState<boolean>(true);

    return (
        <>
            <div
                className={`tech-category-container ${isGroupVisible ? '' : 'rotated'}`}
            >
                <h3 className="tech-category">{groupName}</h3>
                <button
                    className="toggle-visibility-button"
                    onClick={() => setIsGroupVisible((prev) => !prev)}
                    title={`Toggle ${groupName.toLowerCase()} visibility`}
                    aria-label={
                        isGroupVisible
                            ? `Hide ${groupName.toLowerCase()}`
                            : `Show ${groupName.toLowerCase()}`
                    }
                >
                    <KeyboardControlKey
                        className={`toggle-icon ${isGroupVisible ? '' : 'rotated'}`}
                    />
                </button>
            </div>
            {isGroupVisible &&
                sortedTopics.map(([topicLabel]) => {
                    const className: undefined | 'selected' =
                        determineClassName(topicLabel, featuredTopics);

                    return (
                        <li
                            key={topicLabel}
                            title={
                                className !== 'selected'
                                    ? `Click to filter projects by ${topicLabel}`
                                    : `Click to remove ${topicLabel} filter`
                            }
                            className={className}
                            onClick={() =>
                                updateFeaturedTopics(
                                    findKeyForTopicLabel(topicLabel)
                                )
                            }
                        >
                            <label
                                htmlFor={`${topicLabel}-checkbox`}
                                className="checkbox-label"
                            >
                                {className === 'selected' && (
                                    <CheckIcon className="checkbox-icon" />
                                )}
                                <input
                                    id={`${topicLabel}-checkbox`}
                                    aria-label={`Filter projects by ${topicLabel}`}
                                    name={`${topicLabel}-checkbox`}
                                    type="checkbox"
                                    className="checkbox"
                                    checked={
                                        className === 'selected' ? true : false
                                    }
                                    readOnly
                                />
                            </label>
                            <div className="topic-label-container">
                                {topicLabel}
                                {findTopicLabelImageSrc(topicLabel) && (
                                    <img
                                        src={findTopicLabelImageSrc(topicLabel)}
                                        alt={topicLabel}
                                        className="tech-icon"
                                        onLoad={(e) => {
                                            const target: EventTarget =
                                                e.target;

                                            if (
                                                target instanceof
                                                HTMLImageElement
                                            ) {
                                                target.classList.add('loaded');
                                            }
                                        }}
                                    />
                                )}
                            </div>
                            <span className="count">
                                {repos?.reduce((prev, curr) => {
                                    return curr.isFeatured &&
                                        curr.topics.includes(
                                            findKeyForTopicLabel(topicLabel)
                                        )
                                        ? prev + 1
                                        : prev;
                                }, 0)}
                            </span>
                        </li>
                    );
                })}
        </>
    );
};

export default ListItems;
