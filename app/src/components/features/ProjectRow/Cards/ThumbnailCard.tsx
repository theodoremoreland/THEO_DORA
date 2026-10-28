// React
import { ReactElement, useCallback, useMemo, useState } from 'react';

// Components
import Corner from '../../../common/primitives/Corner/Corner';
import GlyphLane from '../../../common/primitives/GlyphLane/GlyphLane';
import ImageCarousel from '../../../common/interactive/ImageCarousel/ImageCarousel';
import DigitalRain from '../../DigitalRain/DigitalRain';
import TopicsFullscreen from '../../DigitalRain/TopicsFullscreen/TopicsFullscreen';

// Custom
import { TaggedRepoData } from '../../../../types';
import getProjectContext, {
    ProjectContext,
} from '../../../../utils/getProjectContext';
import { getImagesFromReadme } from '../../../../modules/readme';

// Icons
import EyeTrackingIcon from '../../../../assets/images/icons/eye_tracking.svg?react';

// Styles
import './ThumbnailCard.css';

enum Tab {
    Screenshots = 'screenshots',
    Topics = 'topics',
}

interface Props {
    hasSettled: boolean;
    projectData: TaggedRepoData;
    readme: string | undefined;
    isReadmeFetching: boolean;
}

const ThumbnailCard = ({
    hasSettled,
    projectData,
    readme,
    isReadmeFetching,
}: Props): ReactElement => {
    const readmeImages: string[] = getImagesFromReadme(
        readme,
        projectData.name
    );
    const projectContext: ProjectContext[] = useMemo(
        () => getProjectContext(projectData),
        [projectData]
    );

    const [activeTab, setActiveTab] = useState<Tab>(Tab.Screenshots);
    const [selectedImageIndex, setSelectedImageIndex] = useState<number>(0);
    const [isImageCarouselOpen, setIsImageCarouselOpen] =
        useState<boolean>(false);

    const handleTabClick = useCallback((tab: Tab) => {
        setActiveTab(tab);
    }, []);
    const handleImageClick = useCallback((index: number) => {
        setSelectedImageIndex(index);
        setIsImageCarouselOpen(true);
    }, []);

    return (
        <li
            className={`project-card-container ${
                projectData.isFeatured ? 'featured' : 'not-featured'
            }`}
        >
            {isImageCarouselOpen && (
                <ImageCarousel
                    name={projectData.name}
                    images={readmeImages}
                    selectedImageIndex={selectedImageIndex}
                    setIsImageCarouselOpen={setIsImageCarouselOpen}
                />
            )}
            <div className="project-card ThumbnailCard">
                <Corner position="top-left" />
                <Corner position="bottom-right" />
                <Corner position="top-right" />
                <Corner position="bottom-left" />
                <div className="top">
                    <div className="pills-and-links">
                        {projectContext.length > 0 &&
                            projectContext.map((context) => (
                                <span
                                    key={context}
                                    title="Project type"
                                    className="project-context"
                                >
                                    #{context}
                                </span>
                            ))}
                    </div>
                    <div
                        className={`project-image-container ${hasSettled ? 'loaded' : 'loading'}`}
                    >
                        <a
                            href={projectData.url}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            {hasSettled && (
                                <img
                                    className="project-image"
                                    onLoad={(e) => {
                                        const target: EventTarget = e.target;

                                        if (
                                            target instanceof HTMLImageElement
                                        ) {
                                            target.classList.add('loaded');
                                        }
                                    }}
                                    src={projectData.image}
                                    alt={projectData.name}
                                />
                            )}
                        </a>
                    </div>
                </div>
                <div className="middle">
                    <GlyphLane />
                    <p className="project-description">{projectData.desc}</p>
                    <GlyphLane />
                </div>
                <div className="bottom">
                    <h4 className="project-screenshots-title large">
                        Screenshots
                    </h4>
                    <h4 className="project-screenshots-title small">
                        <button
                            className={`tab-button ${activeTab === Tab.Screenshots ? 'active' : 'inactive'}`}
                            type="button"
                            onClick={() => handleTabClick(Tab.Screenshots)}
                        >
                            Screenshots
                        </button>
                        <span>/</span>
                        <button
                            className={`tab-button ${activeTab === Tab.Screenshots ? 'inactive' : 'active'}`}
                            type="button"
                            onClick={() => handleTabClick(Tab.Topics)}
                        >
                            Topics
                        </button>
                    </h4>
                    <div
                        className={`project-screenshots-container ${activeTab === Tab.Screenshots ? 'show' : 'hide'}`}
                    >
                        <ul className="project-screenshots">
                            {!isReadmeFetching &&
                                hasSettled &&
                                readmeImages.slice(0, 4).map((src, index) => (
                                    <li
                                        role="button"
                                        title={`Click to view ${projectData.name} screenshot`}
                                        tabIndex={0}
                                        key={src}
                                        onClick={() => handleImageClick(index)}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') {
                                                handleImageClick(index);
                                            }
                                        }}
                                    >
                                        <img
                                            className="project-screenshot"
                                            src={src}
                                            alt={`${projectData.name} screenshot ${index + 1}`}
                                        />
                                    </li>
                                ))}
                        </ul>
                    </div>
                    <Topics
                        show={activeTab === Tab.Topics && hasSettled}
                        projectData={projectData}
                    />
                </div>
            </div>
            <div className="trailing-text">
                <p>Thumbnail</p>
            </div>
        </li>
    );
};

export default ThumbnailCard;

interface TopicsProps {
    projectData: TaggedRepoData;
    show: boolean;
}

const Topics = ({ projectData, show }: TopicsProps): ReactElement => {
    const [showTopicsFullscreen, setShowTopicsFullscreen] =
        useState<boolean>(false);

    return (
        <>
            <div className={`topics-container ${show ? 'show' : 'hide'}`}>
                <div className="topics-dialog">
                    <button
                        title="View project topics"
                        className="view-topics"
                        type="button"
                        onClick={() => setShowTopicsFullscreen(true)}
                    >
                        <EyeTrackingIcon className="icon" />
                        <span>View</span>
                    </button>
                </div>

                {show && (
                    <DigitalRain
                        topics={projectData.topics}
                        shouldAnimate
                        garganta
                    />
                )}
            </div>
            {show && (
                <TopicsFullscreen
                    show={showTopicsFullscreen}
                    setShow={setShowTopicsFullscreen}
                    topics={projectData.topics}
                    projectName={projectData.name}
                />
            )}
        </>
    );
};
