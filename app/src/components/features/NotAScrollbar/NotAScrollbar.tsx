// React
import { ReactElement } from 'react';

// Components
import Barcode from '../../common/primitives/Barcode/Barcode';
import Corner from '../../common/primitives/Corner/Corner';

// Types
import { TaggedRepoData } from '../../../types';

// Styles
import './NotAScrollbar.css';

interface Props {
    scrollToProject: (id: string) => void;
    projects: TaggedRepoData[];
    selectedProject: TaggedRepoData;
}

const NotAScrollbar = ({
    scrollToProject,
    projects,
    selectedProject,
}: Props): ReactElement => {
    return (
        <div id="NotAScrollbar">
            <ol id="project-options">
                {projects?.map((project, index) => {
                    const isSelectedProject: boolean =
                        selectedProject.name === project.name;
                    let classState: string = '';

                    if (!project.isFeatured) {
                        classState += ' disabled';
                    }

                    if (isSelectedProject) {
                        classState += ' selected';
                    }

                    return (
                        <li
                            key={project.name}
                            className={`project-option ${classState}`}
                        >
                            <button
                                id={`scroll-to-${project.name}-button`}
                                disabled={classState.trim() === 'disabled'}
                                onClick={() => scrollToProject(project.name)}
                            >
                                <span className="index">-{index + 1}</span>
                            </button>
                            <span className="project-name">
                                <Corner position="top-left" />
                                <Corner position="bottom-right" />
                                <Corner position="top-right" />
                                <Corner position="bottom-left" />
                                <Barcode value={project.name} />
                                <p>{project.name}</p>
                            </span>
                        </li>
                    );
                })}
            </ol>
        </div>
    );
};

export default NotAScrollbar;
