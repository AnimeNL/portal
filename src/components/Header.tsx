// Copyright 2019 Peter Beverloo. All rights reserved.
// Use of this source code is governed by the MIT license, a copy of which can
// be found in the LICENSE file.

import React from 'react';
import bind from 'bind-decorator';

import { AboutDialog } from './AboutDialog';
import Environment from '../app/Environment';
import Event from '../app/Event';
import { MenuNotifier } from '../menu';
import { SearchBox } from './SearchBox';
import { ThemeProvider } from '../theme';
import { TitleManager, TitleObserver } from '../title';
import { kEnableDarkTheme, kEnableHeaderTitle, kDrawerWidth } from '../config';

import AppBar from '@material-ui/core/AppBar';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MenuIcon from '@material-ui/icons/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import { Theme } from '@material-ui/core/styles/createMuiTheme';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import createStyles from '@material-ui/core/styles/createStyles';
import withStyles, { WithStyles } from '@material-ui/core/styles/withStyles';

const styles = (theme: Theme) =>
    createStyles({
        grow: {
            flexGrow: 1,
            overflow: 'hidden',
            whiteSpace: 'nowrap',
        },
        appBar: {
            backgroundColor: theme.headerBackgroundColor,

            marginLeft: kDrawerWidth,
            paddingRight: '0px !important',
            [theme.breakpoints.up('sm')]: {
                zIndex: theme.zIndex.drawer + 1,
            },
        },
        toolbar: {

        },
        buttons: {
            display: 'flex',
            alignItems: 'center',
        },
        menuButton: {
            marginLeft: -12,
            marginRight: 20,

            [theme.breakpoints.up('sm')]: {
                display: 'none',
            },
        },
        overflowButton: {
            marginRight: -12
        },
    });

/**
 * Events supported by the <Header> element. These will be proxied by the <PortalView>.
 */
export interface HeaderEvents {
    /**
     * Event to be called when the user should be logged out.
     */
    onLogout: () => void;

    /**
     * Event to be called when the application should be refreshed.
     */
    onRefresh: () => void;
}

/**
 * Properties accepted by the <Header> element.
 */
interface Properties extends HeaderEvents, WithStyles<typeof styles> {
    /**
     * The event for which the portal is being rendered. Used for and by the search box.
     */
    event: Event;

    /**
     * The environment for the volunteer portal. Used to determine the page's title.
     */
    environment: Environment;
}

/**
 * Dynamic state of the <Header> element.
 */
interface State {
    /**
     * Whether the about dialog has been opened.
     */
    aboutDialogOpened: boolean;

    /**
     * The HTMLElement to which the overflow menu should be anchored, if any.
     */
    overflowMenuAnchor: HTMLElement | null;

    /**
     * Whether the overflow menu should be opened.
     */
    overflowMenuOpened: boolean;

    /**
     * The title that should be displayed on the page.
     */
    title: string;
}

/**
 * The application-level header. It serves three main purposes: toggling the main menu, displaying
 * the current page's title and providing access to the overflow menu.
 */
class Header extends React.Component<Properties, State> implements TitleObserver {
    state: State = {
        aboutDialogOpened: false,
        overflowMenuAnchor: null,
        overflowMenuOpened: false,
        title: 'Volunteer Portal',
    };

    /**
     * Called when the component is about to mount. Populate the initial page header.
     */
    componentWillMount() {
        const { environment } = this.props;

        if (kEnableHeaderTitle)
            TitleManager.addObserver(this);

        this.setState({
            title: environment.portalTitle,
        });
    }

    /**
     * Called when the page's title is being updated. Will update the internal state so that the
     * change can be reflected in the page header.
     */
    onTitleUpdate(title: string | null): void {
        const { environment } = this.props;

        this.setState({
            title: title ? title
                         : environment.portalTitle
        });
    }

    /**
     * Determines whether the header component has to be updated. We only do this when the overflow
     * menu or the title changes.
     */
    shouldComponentUpdate(nextProps: Properties, nextState: State): boolean {
        if (nextState.aboutDialogOpened !== this.state.aboutDialogOpened ||
            nextState.overflowMenuOpened !== this.state.overflowMenuOpened) {
            return true;
        }

        if (kEnableHeaderTitle && nextState.title !== this.state.title)
            return true;

        return false;
    }

    /**
     * Called when the component is about to be removed. Remove ourselves from observing the title.
     */
    componentWillUnmount() {
        if (kEnableHeaderTitle)
            TitleManager.removeObserver(this);
    }

    /**
     * To be called when the about dialog should be opened.
     */
    @bind
    openAboutDialog(): void {
        this.setState({
            aboutDialogOpened: true,
            overflowMenuOpened: false,
        });
    }

    /**
     * To be called when the about dialog has to be closed.
     */
    @bind
    closeAboutDialog(): void {
        this.setState({
            aboutDialogOpened: false,
        });
    }

    /**
     * Requests the page's main menu to open. Only applicable on small screens.
     */
    @bind
    openMenu(): void {
        MenuNotifier.openMenu();
    }

    /**
     * Called when the overflow menu should be closed. This will be triggered when the user clicks
     * anywhere outside of the menu's boundaries while it's opened.
     */
    @bind
    closeOverflowMenu(): void {
        this.setState({
            overflowMenuOpened: false
        });
    }

    /**
     * Toggles whether dark theme should be enabled. The menu option allows users to switch between
     * force dark theme (enabled) and default dark theme (undefined).
     */
    @bind
    onToggleDarkTheme(): void {
        const enabled = ThemeProvider.isDarkThemeEnabled();

        ThemeProvider.setDarkThemeEnabled(enabled ? undefined
                                                  : true);

        // Reload the page for dark theme to take effect.
        window.location.reload();
    }

    /**
     * Called when the overflow menu should be opened. The given |event| provides access to the icon
     * itself, which will be the anchor for the to-be-opened menu element.
     *
     * @param event Mouse event containing the menu's target.
     */
    @bind
    openOverflowMenu(event: React.MouseEvent<HTMLElement>): void {
        this.setState({
            overflowMenuAnchor: event.currentTarget,
            overflowMenuOpened: true
        });
    }

    render() {
        const { classes, event, onLogout, onRefresh } = this.props;
        const { aboutDialogOpened, title } = this.state;

        return (
            <AppBar position="fixed" className={classes.appBar}>
                <Toolbar>

                    <IconButton
                        aria-label="Menu"
                        className={classes.menuButton}
                        color="inherit"
                        onClick={this.openMenu}>

                        <MenuIcon />

                    </IconButton>

                    <Typography variant="h6" color="inherit" noWrap className={classes.grow}>
                        {title}
                    </Typography>

                    <div className={classes.buttons}>

                        <SearchBox event={event} />

                        <IconButton
                            aria-label="Overflow menu"
                            aria-owns={this.state.overflowMenuOpened ? 'overflow-menu' : undefined}
                            aria-haspopup="true"
                            className={classes.overflowButton}
                            color="inherit"
                            onClick={this.openOverflowMenu}>

                            <MoreVertIcon />

                        </IconButton>

                        <Menu
                            id="overflow-menu"
                            disableAutoFocusItem={true}
                            anchorEl={this.state.overflowMenuAnchor}
                            anchorOrigin={{vertical: 'top', horizontal: 'right'}}
                            transformOrigin={{vertical: 'top', horizontal: 'right'}}
                            open={this.state.overflowMenuOpened}
                            onClose={this.closeOverflowMenu}>

                            <MenuItem onClick={this.openAboutDialog}>
                                About the Portal
                            </MenuItem>

                            { kEnableDarkTheme &&
                                <MenuItem onClick={this.onToggleDarkTheme}>
                                    { ThemeProvider.isDarkThemeEnabled()
                                          ? 'Light theme'
                                          : 'Dark theme' }
                                </MenuItem> }

                            <Divider />

                            <MenuItem onClick={onRefresh}>
                                Refresh
                            </MenuItem>

                            <MenuItem onClick={onLogout}>
                                Sign out
                            </MenuItem>

                        </Menu>
                    </div>

                    <AboutDialog onClose={this.closeAboutDialog}
                                 open={aboutDialogOpened} />

                </Toolbar>
            </AppBar>
        )
    }
}

const StyledHeader = withStyles(styles)(Header);
export { StyledHeader as Header };
