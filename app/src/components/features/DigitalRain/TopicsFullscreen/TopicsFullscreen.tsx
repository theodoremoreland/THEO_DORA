// React
import { ReactElement, useContext, useMemo } from 'react';

// Custom
import { properCase } from '../../../../utils/properCase';
import formatPercentile from '../../../../utils/formatPercentile';
import rateTypicality from '../../../../utils/typicalityRating';

// Context
import { ProjectsContext } from '../../../../contexts/ProjectsContext';

// Components
import DigitalRain from '../DigitalRain';

// Styles
import './TopicsFullscreen.css';

interface Props {
    show: boolean;
    setShow: (show: boolean) => void;
    projectName: string;
    topics: string[];
}

const TopicsFullscreen = ({
    show,
    setShow,
    projectName,
    topics,
}: Props): ReactElement => {
    const { pairwiseJaccardSimilarity } = useContext(ProjectsContext);

    const casedTopics: string[] = useMemo(() => properCase(topics), [topics]);
    const jaccardSimilarity = pairwiseJaccardSimilarity?.[projectName];

    return (
        <div className={`TopicsFullscreen ${show ? 'show' : 'hide'}`}>
            <div className="layer">
                <div className="content">
                    <button
                        type="button"
                        title="Close"
                        className="close-button"
                        onClick={() => setShow(false)}
                    >
                        Close
                    </button>
                    <div className="banner">
                        <h2 className="title">{projectName}</h2>
                        <p className="subtitle">
                            {casedTopics.length} GitHub topics
                        </p>
                        {jaccardSimilarity && (
                            <ul className="jaccard-similarity-list">
                                <li>
                                    <p>
                                        This project's set of topics are in the{' '}
                                        <span>
                                            {formatPercentile(
                                                jaccardSimilarity.jaccardSimilarityNormalized *
                                                    100
                                            )}
                                        </span>{' '}
                                        percentile for typicality across all
                                        projects. This set is{' '}
                                        {rateTypicality(
                                            jaccardSimilarity.jaccardSimilarityNormalized *
                                                100
                                        )}
                                        .
                                    </p>
                                </li>
                                <li>
                                    <p>
                                        Topics for this project overlap with
                                        topics in other projects{' '}
                                        <span>
                                            {(
                                                jaccardSimilarity.jaccardSimilarityStandard *
                                                100
                                            ).toFixed(2)}
                                            %
                                        </span>{' '}
                                        of the time.
                                    </p>
                                </li>
                                <li>
                                    <p>
                                        The project with the most similar set of
                                        topics is project{' '}
                                        <span>
                                            #
                                            {jaccardSimilarity.closestMatch
                                                .index + 1}{' '}
                                            {
                                                jaccardSimilarity.closestMatch
                                                    .projectName
                                            }
                                        </span>{' '}
                                        with an overlap of{' '}
                                        <span>
                                            {(
                                                jaccardSimilarity.closestMatch
                                                    .likeness * 100
                                            ).toFixed(2)}
                                            %.
                                        </span>
                                    </p>
                                </li>
                            </ul>
                        )}
                        <ul className="topics-list">
                            {casedTopics.map((topic, index) => (
                                <li
                                    key={topics[index]}
                                    style={
                                        { '--i': index } as React.CSSProperties
                                    }
                                >
                                    <a
                                        id={`topic-link-${topics[index]}`}
                                        href={`https://github.com/topics/${topics[index]}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        {topic}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
            <DigitalRain
                shouldAnimate={show}
                garganta={false}
                topics={casedTopics}
                shouldProperCase={false}
            />
        </div>
    );
};

export default TopicsFullscreen;
