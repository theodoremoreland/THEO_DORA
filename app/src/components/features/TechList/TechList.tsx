// React
import {
    Dispatch,
    ReactElement,
    SetStateAction,
    useCallback,
    useContext,
    useEffect,
    useState,
    MouseEvent,
    useMemo,
} from 'react';

// Context
import { ProjectsContext } from '../../../contexts/ProjectsContext';

// Custom
import { getTopicCounts } from './TechList.controller';
import ListItems from './ListItems';

// Types
import { TopicCounts } from '../../../types';

// Styles
import './TechList.css';

interface Props {
    setShowTechList: Dispatch<SetStateAction<boolean>>;
}

const TechList = ({ setShowTechList }: Props): ReactElement => {
    const { repos, updateFeaturedTopics, featuredTopics } =
        useContext(ProjectsContext);

    const featuredCount: number = useMemo(() => {
        if (!repos) {
            return 0;
        }

        return repos?.reduce((prev, curr) => {
            return curr.isFeatured ? prev + 1 : prev;
        }, 0);
    }, [repos]);

    const [topicsCount, setTopicsCount] = useState<TopicCounts | null>(null);

    const handleClickAway = useCallback(
        (event: MouseEvent) => {
            if (event.target === event.currentTarget) {
                setShowTechList(false);
            }
        },
        [setShowTechList]
    );

    useEffect(() => {
        if (repos) {
            setTopicsCount(getTopicCounts(repos));
        }
    }, [repos]);

    return (
        <>
            <div id="clickaway-area__filter" onClick={handleClickAway}></div>
            <div id="tech-list-container">
                <div className="header">
                    <h2>Filter projects</h2>
                    <span>
                        {featuredTopics.size} applied, {featuredCount} results
                    </span>
                </div>
                {topicsCount && repos && (
                    <ul id="tech-list">
                        <ListItems
                            groupName="Competencies"
                            repos={repos}
                            topics={topicsCount.competencies}
                            featuredTopics={featuredTopics}
                            updateFeaturedTopics={updateFeaturedTopics}
                        />
                        <ListItems
                            groupName="Languages"
                            repos={repos}
                            topics={topicsCount.languages}
                            featuredTopics={featuredTopics}
                            updateFeaturedTopics={updateFeaturedTopics}
                        />
                        <ListItems
                            groupName="Frameworks"
                            repos={repos}
                            topics={topicsCount.frameworks}
                            featuredTopics={featuredTopics}
                            updateFeaturedTopics={updateFeaturedTopics}
                        />
                        <ListItems
                            groupName="Tools"
                            repos={repos}
                            topics={topicsCount.tools}
                            featuredTopics={featuredTopics}
                            updateFeaturedTopics={updateFeaturedTopics}
                        />
                    </ul>
                )}
            </div>
        </>
    );
};

export default TechList;
