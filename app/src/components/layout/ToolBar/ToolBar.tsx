// React
import { ReactElement, useState } from 'react';

// Components
import SearchBar from '../../features/SearchBar/SearchBar';
import TechList from '../../features/TechList/TechList';

// Images
import InfoIcon from '../../../assets/images/icons/info.svg?react';
import PersonIcon from '../../../assets/images/icons/person.svg?react';
import FilterListIcon from '../../../assets/images/icons/filter_list.svg?react';

// Styles
import './ToolBar.css';

const isDevEnv: boolean = import.meta.env.DEV;

interface Props {
    scrollToProject: (id: string) => void;
    setShowOverviewModal: (show: boolean) => void;
}

const ToolBar = ({
    setShowOverviewModal,
    scrollToProject,
}: Props): ReactElement => {
    const [showTechList, setShowTechList] = useState<boolean>(false);

    return (
        <footer id="app-toolbar">
            <div id="app-toolbar-content">
                <div id="toolbar-left">
                    <SearchBar scrollToProject={scrollToProject} />
                </div>
                <ul id="toolbar-right">
                    {isDevEnv && (
                        <li className="toolbar-item">
                            <button
                                id="active-users-button"
                                className="toolbar-button"
                                type="button"
                            >
                                <PersonIcon className="person icon" />
                            </button>
                        </li>
                    )}
                    <li className="toolbar-item">
                        {showTechList && (
                            <TechList setShowTechList={setShowTechList} />
                        )}
                        <button
                            id="filter-dropdown-button"
                            type="button"
                            title="Filter projects"
                            onClick={() => setShowTechList(!showTechList)}
                            className={`toolbar-button ${showTechList ? 'active' : ''}`}
                        >
                            <FilterListIcon className="filter icon" />
                        </button>
                    </li>
                    <li className="toolbar-item">
                        <button
                            id="nav-overview"
                            title="Overview"
                            role="presentation"
                            onClick={() => setShowOverviewModal(true)}
                            className={`toolbar-button`}
                        >
                            <InfoIcon className="info icon" />
                        </button>
                    </li>
                </ul>
            </div>
        </footer>
    );
};

export default ToolBar;
