import {
    useState,
    useContext,
    useCallback,
    useEffect,
    useRef,
    ReactElement,
} from 'react';

// Third party
import Fuse, { FuseResult } from 'fuse.js';

// Context
import { ProjectsContext } from '../../../contexts/ProjectsContext';

// Types
import { TaggedRepoData } from '../../../types';

// Images
import SearchIcon from '../../../assets/images/icons/search.svg?react';
import CancelIcon from '../../../assets/images/icons/cancel.svg?react';

// Styles
import './SearchBar.css';

interface Props {
    scrollToProject: (id: string) => void;
}

const SearchBar = ({ scrollToProject }: Props): ReactElement => {
    const { repos } = useContext(ProjectsContext);
    const [searchValue, setSearchValue] = useState('');
    const [searchResults, setSearchResults] = useState<
        FuseResult<TaggedRepoData>[] | TaggedRepoData[] | undefined
    >(repos);
    const [showResults, setShowResults] = useState(false);
    const inputRef = useRef<HTMLInputElement | null>(null);

    const handleSearchResultClick = useCallback(
        (projectData: TaggedRepoData) => {
            setSearchValue('');
            scrollToProject(projectData.name);
        },
        [scrollToProject]
    );

    const handleCancelClick = useCallback(() => {
        setSearchValue('');
        inputRef?.current?.focus();
    }, [inputRef]);

    useEffect(() => {
        const input = inputRef.current;
        const focusHandler = () => setShowResults(true);

        if (input) {
            input.addEventListener('focus', focusHandler);
        }

        return () => {
            if (input) {
                input.removeEventListener('focus', focusHandler);
            }
        };
    }, [inputRef]);

    useEffect(() => {
        const hasFocus = inputRef?.current === document.activeElement;

        if (hasFocus && searchValue && repos) {
            const fuse = new Fuse(repos, {
                keys: ['name', 'topics'],
                threshold: 0.3,
            });
            const results = fuse.search(searchValue);

            results.sort((a, b) => {
                return a.refIndex - b.refIndex;
            });

            setSearchResults(results);
        }
    }, [searchValue, repos]);

    return (
        <>
            {searchValue && showResults && (
                <div
                    id="clickaway-area__search"
                    onClick={() => setShowResults(false)}
                ></div>
            )}
            <div id="search-bar" className={`${showResults ? 'active' : ''}`}>
                <span id="search-icon-area" onClick={handleCancelClick}>
                    <SearchIcon className="icon" />
                </span>
                <input
                    ref={inputRef}
                    id="search"
                    type="text"
                    aria-label="Search GitHub projects"
                    // TODO: consider supporting comma delineated / multiple word search
                    placeholder="Find GitHub projects by topic or name"
                    autoComplete="off"
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                />
                <span id="delete-icon-area" onClick={handleCancelClick}>
                    <CancelIcon className="icon" />
                </span>
                {searchValue && showResults && (
                    // Wrapper is here solely for the purpose of positioning data attribute (i.e. result count) in desired location
                    <div
                        className="search-results-wrapper"
                        data-result-count={`${
                            searchResults?.length || 0
                        } results`}
                    >
                        <ul id="search-results">
                            {searchResults && searchResults?.length > 0 ? (
                                searchResults.map((searchResult) => {
                                    const repo =
                                        Object.prototype.hasOwnProperty.call(
                                            searchResult,
                                            'item'
                                        )
                                            ? (
                                                  searchResult as FuseResult<TaggedRepoData>
                                              ).item
                                            : undefined;

                                    if (!repo) {
                                        return null;
                                    }

                                    const matchingTopics = new Fuse(
                                        repo.topics,
                                        {
                                            threshold: 0.3,
                                        }
                                    );
                                    const topics =
                                        matchingTopics.search(searchValue);

                                    return (
                                        <li
                                            key={repo.name}
                                            className="search-result"
                                            onClick={() =>
                                                handleSearchResultClick(repo)
                                            }
                                        >
                                            <p className="title">{repo.name}</p>
                                            <img
                                                loading="lazy"
                                                src={repo.image}
                                                alt={repo.name}
                                            />
                                            <div className="topics">
                                                {topics.length > 0 ? (
                                                    topics.map(
                                                        (topicResult) => {
                                                            const topic =
                                                                topicResult.item;

                                                            return (
                                                                <span
                                                                    key={topic}
                                                                    className="topic"
                                                                >
                                                                    {topic}
                                                                </span>
                                                            );
                                                        }
                                                    )
                                                ) : (
                                                    <p className="none">
                                                        No matching topics
                                                    </p>
                                                )}
                                            </div>
                                        </li>
                                    );
                                })
                            ) : (
                                <li className="search-result">
                                    No results found
                                </li>
                            )}
                        </ul>
                    </div>
                )}
            </div>
        </>
    );
};

export default SearchBar;
