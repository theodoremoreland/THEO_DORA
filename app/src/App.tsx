// React
import {
    useEffect,
    useState,
    useCallback,
    useContext,
    useRef,
    ReactElement,
} from 'react';

// Context
import { ProjectsContext } from './contexts/ProjectsContext';

// Custom Components
import Analytics from './components/features/Analytics/Analytics';
import NavBar from './components/layout/NavBar/NavBar';
import ProjectRow from './components/features/ProjectRow/ProjectRow';
import ToolBar from './components/layout/ToolBar/ToolBar';
import Overview from './components/common/interactive/Modal/Overview/Overview';
import ErrorModal from './components/common/interactive/Modal/ErrorModal/ErrorModal';
import NotAScrollbar from './components/features/NotAScrollbar/NotAScrollbar';

// Custom Styles
import './index.css';
import './App.css';

const App = (): ReactElement => {
    // Context
    const { repos, isError, selectedProject, setSelectedProject } =
        useContext(ProjectsContext);

    // Refs
    const titleCardRef = useRef<HTMLElement>(null);
    const intervalRef = useRef<number | undefined>(undefined);
    const projectsSectionRef = useRef<HTMLDivElement>(null);

    // State (boolean)
    const [showErrorModal, setShowErrorModal] = useState<boolean>(false);
    const [showAnalytics, setShowAnalytics] = useState<boolean>(false);
    const [showOverviewModal, setShowOverviewModal] = useState<boolean>(false);
    const [showDigitalRainAnimation, setShowDigitalRainAnimation] =
        useState<boolean>(true);

    // Handlers
    const handleCloseErrorModal = useCallback(
        () => setShowErrorModal(false),
        []
    );
    const handleShowErrorModal = useCallback(() => setShowErrorModal(true), []);
    const scrollToProject = useCallback((id: string) => {
        // Search for the ID strictly inside the parent container
        const sectionElement = projectsSectionRef.current?.querySelector(
            `#${id}`
        );

        if (sectionElement) {
            sectionElement.scrollIntoView({ behavior: 'smooth' });
        }
    }, []);

    useEffect(() => {
        if (isError) {
            handleShowErrorModal();
        }
    }, [isError, handleShowErrorModal]);

    /**
     * Checks to see when titleCard animation is complete
     * then sets the display to none as to remove it from
     * the DOM's render tree (hoping this helps with performance of shine animations).
     */
    useEffect(() => {
        const titleCard: HTMLElement | null = titleCardRef.current;
        const shouldSetInterval: boolean | null | undefined =
            repos && titleCard && intervalRef.current === undefined;

        if (shouldSetInterval) {
            intervalRef.current = window.setInterval(() => {
                if (!titleCard) return;

                const titleCardStyle = getComputedStyle(titleCard);

                if (titleCardStyle.visibility === 'hidden') {
                    titleCard.style.display = 'none'; // All this to help with performance

                    window.clearInterval(intervalRef.current);
                }
            }, 500);
        }

        return () => window.clearInterval(intervalRef.current);
    }, [repos]);

    return (
        <>
            {showErrorModal && (
                <ErrorModal handleClose={handleCloseErrorModal} />
            )}
            <header
                ref={titleCardRef}
                className={`title-card ${repos ? 'transition' : ''}`}
            >
                {/* <video id="intro-video" playsInline loop muted autoPlay>
                    <source
                        src="https://videos.pexels.com/video-files/34908014/14788136_1920_1080_30fps.mp4"
                        type="video/mp4"
                    />
                </video> */}
                <h1 className={`app-title ${repos ? 'transition' : ''}`}>
                    THEO_DORA
                </h1>
                {repos ? (
                    <p className="app-subtitle">
                        {repos.length} projects available
                    </p>
                ) : (
                    <p className="app-subtitle loading">
                        Loading projects from GitHub...
                    </p>
                )}
            </header>
            <main>
                <NavBar
                    setShowAnalytics={setShowAnalytics}
                    setShowOverviewModal={setShowOverviewModal}
                />
                <div id="app-content">
                    <div className="row">
                        {repos && (
                            <section id="projects" ref={projectsSectionRef}>
                                {repos &&
                                    repos.map((repo) => {
                                        return (
                                            <ProjectRow
                                                key={repo.name}
                                                projectData={repo}
                                                setSelectedProject={
                                                    setSelectedProject
                                                }
                                                showDigitalRainAnimation={
                                                    showDigitalRainAnimation
                                                }
                                                setShowDigitalRainAnimation={
                                                    setShowDigitalRainAnimation
                                                }
                                            />
                                        );
                                    })}
                            </section>
                        )}
                        {showAnalytics && repos && (
                            <Analytics
                                projects={repos}
                                handleClose={() => setShowAnalytics(false)}
                            />
                        )}
                        {showOverviewModal && (
                            <Overview
                                handleClose={() => setShowOverviewModal(false)}
                            />
                        )}
                        {repos && (
                            <NotAScrollbar
                                scrollToProject={scrollToProject}
                                projects={repos}
                                selectedProject={selectedProject || repos[0]}
                            />
                        )}
                    </div>
                </div>
                <ToolBar
                    scrollToProject={scrollToProject}
                    setShowOverviewModal={setShowOverviewModal}
                />
            </main>
        </>
    );
};

export default App;
