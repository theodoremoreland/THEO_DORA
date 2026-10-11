// React
import { ReactElement, useCallback, useMemo, useState } from 'react';

// Components
import Corner from '../../../common/primitives/Corner/Corner';
import GlyphLane from '../../../common/primitives/GlyphLane/GlyphLane';
import ImageCarousel from '../../../common/ImageCarousel/ImageCarousel';

// Custom
import { TaggedRepoData } from '../../../../types';
import getProjectContext, {
    ProjectContext,
} from '../../../../utils/getProjectContext';
import { getImagesFromReadme } from '../../../../modules/readme';

// Styles
import './ThumbnailCard.css';

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

    const [selectedImageIndex, setSelectedImageIndex] = useState<number>(0);
    const [isImageCarouselOpen, setIsImageCarouselOpen] =
        useState<boolean>(false);

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
                                    title="Project type"
                                    className="project-context"
                                >
                                    {context}
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
                    <h4 className="project-screenshots-title">Screenshots</h4>
                    <div className="project-screenshots-container">
                        <ul className="project-screenshots">
                            {!isReadmeFetching &&
                                hasSettled &&
                                readmeImages.slice(0, 4).map((src, index) => (
                                    <li
                                        key={index}
                                        onClick={() => handleImageClick(index)}
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
                </div>
            </div>
            <div className="trailing-text">
                <p>Thumbnail</p>
            </div>
        </li>
    );
};

export default ThumbnailCard;
