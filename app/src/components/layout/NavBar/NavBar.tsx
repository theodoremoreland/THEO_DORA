import { ReactElement } from 'react';

// Images
import QueryStatsIcon from '../../../assets/images/icons/query_stats.svg?react';
import GitHubIcon from '../../../assets/images/icons/github.svg?react';

// Styles
import './NavBar.css';

interface Props {
    setShowAnalytics: (show: boolean) => void;
    setShowOverviewModal: (show: boolean) => void;
}

const isDevEnv: boolean = import.meta.env.DEV;

const NavBar = ({ setShowAnalytics }: Props): ReactElement => {
    return (
        <nav id="app-nav">
            <div id="nav-content">
                <h1>THEO_DORA</h1>
                <ul id="desktop-menu">
                    {isDevEnv && (
                        <li
                            id="analytics-nav"
                            title="Analytics"
                            role="presentation"
                            onClick={() => setShowAnalytics(true)}
                        >
                            <QueryStatsIcon className="query_stats icon" />
                            <span>Analytics</span>
                        </li>
                    )}
                    <a
                        href="https://github.com/theodoremoreland"
                        target="_blank"
                        rel="noreferrer"
                    >
                        <li
                            id="github-nav"
                            title="My GitHub"
                            role="presentation"
                        >
                            <GitHubIcon
                                id="github-icon"
                                className="github icon"
                            />
                            <span>My GitHub</span>
                        </li>
                    </a>
                </ul>
            </div>
        </nav>
    );
};

export default NavBar;
