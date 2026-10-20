import { ReactElement, useState, useCallback } from 'react';

// MUI
import { IconButton, Menu, MenuItem } from '@mui/material';

// Images
import QueryStatsIcon from '../../../assets/images/icons/query_stats.svg?react';
import InfoIcon from '../../../assets/images/icons/info.svg?react';
import MenuIcon from '../../../assets/images/icons/menu.svg?react';
import GitHubIcon from '../../../assets/images/icons/github.svg?react';

// Styles
import './NavBar.css';

interface Props {
    setShowAnalytics: (show: boolean) => void;
    setShowOverviewModal: (show: boolean) => void;
}

const isDevEnv: boolean = import.meta.env.DEV;

const NavBar = ({
    setShowAnalytics,
    setShowOverviewModal,
}: Props): ReactElement => {
    const [mobileMenuAnchorEl, setMobileMenuAnchorEl] =
        useState<null | HTMLElement>(null);
    const isMobileMenuOpen = Boolean(mobileMenuAnchorEl);

    const handleMobileMenuOpen = useCallback(
        (event: React.MouseEvent<HTMLElement>) => {
            setMobileMenuAnchorEl(event.currentTarget);
        },
        []
    );

    const handleMobileMenuClose = useCallback(() => {
        setMobileMenuAnchorEl(null);
    }, []);

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
                <IconButton
                    id="mobile-menu-icon"
                    aria-label="menu"
                    aria-controls={isMobileMenuOpen ? 'basic-menu' : undefined}
                    aria-haspopup="true"
                    aria-expanded={isMobileMenuOpen ? 'true' : undefined}
                    onClick={handleMobileMenuOpen}
                >
                    <MenuIcon />
                </IconButton>
                <Menu
                    id="mobile-menu"
                    anchorEl={mobileMenuAnchorEl}
                    open={isMobileMenuOpen}
                    onClose={handleMobileMenuClose}
                >
                    {isDevEnv && (
                        <MenuItem
                            id="analytics-nav"
                            className="mobile-menu-item"
                            title="Analytics"
                            onClick={() => {
                                setShowAnalytics(true);
                                handleMobileMenuClose();
                            }}
                        >
                            <QueryStatsIcon className="query_stats icon" />
                            <span>Analytics</span>
                        </MenuItem>
                    )}
                    <MenuItem
                        id="github-nav"
                        className="mobile-menu-item"
                        title="My GitHub"
                    >
                        <a
                            href="https://github.com/theodoremoreland"
                            target="_blank"
                            rel="noreferrer"
                        >
                            <GitHubIcon
                                id="github-icon"
                                className="github icon"
                            />
                            <span>My GitHub</span>
                        </a>
                    </MenuItem>
                    <MenuItem
                        id="overview-nav"
                        className="mobile-menu-item"
                        title="Overview"
                        onClick={() => {
                            setShowOverviewModal(true);
                            handleMobileMenuClose();
                        }}
                    >
                        <InfoIcon className="overview icon" />
                        <span>Overview</span>
                    </MenuItem>
                </Menu>
            </div>
        </nav>
    );
};

export default NavBar;
