// Copyright 2019 Peter Beverloo. All rights reserved.
// Use of this source code is governed by the MIT license, a copy of which can
// be found in the LICENSE file.

import React from 'react';
import bind from 'bind-decorator';

import { SearchBox } from './SearchBox';
import { kDrawerWidth } from '../config';

import AppBar from '@material-ui/core/AppBar';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import IconButton from '@material-ui/core/IconButton';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import Menu from '@material-ui/core/Menu';
import MenuIcon from '@material-ui/icons/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import RefreshIcon from '@material-ui/icons/Refresh';
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
     * Event to be called when the menu button in the header has been clicked on.
     */
    onMenuClick: () => void;
}

/**
 * Dynamic state of the <Header> element.
 */
interface State {
    /**
     * The HTMLElement to which the overflow menu should be anchored, if any.
     */
    overflowMenuAnchor: HTMLElement | null,

    /**
     * Whether the overflow menu should be opened.
     */
    overflowMenuOpened: boolean,
}

/**
 * The application-level header. It serves three main purposes: toggling the main menu, displaying
 * the current page's title and providing access to the overflow menu.
 */
class Header extends React.Component<Properties, State> {
    state: State = {
        overflowMenuAnchor: null,
        overflowMenuOpened: false,
    };

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
        const { children, classes, onMenuClick, onLogout, onRefresh } = this.props;

        return (
            <AppBar position="fixed" className={classes.appBar}>
                <Toolbar>

                    <IconButton
                        aria-label="Menu"
                        className={classes.menuButton}
                        color="inherit"
                        onClick={onMenuClick}>

                        <MenuIcon />

                    </IconButton>

                    <Typography variant="h6" color="inherit" className={classes.grow}>
                        {children}
                    </Typography>

                    <div className={classes.buttons}>
                        <SearchBox />

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

                            <MenuItem onClick={onRefresh}>
                                <ListItemIcon>
                                    <RefreshIcon />
                                </ListItemIcon>

                                <Typography variant="inherit">Refresh</Typography>
                            </MenuItem>

                            <MenuItem onClick={onLogout}>
                                <ListItemIcon>
                                    <ExitToAppIcon />
                                </ListItemIcon>

                                <Typography variant="inherit">Sign out</Typography>
                            </MenuItem>

                        </Menu>
                    </div>

                </Toolbar>
            </AppBar>
        )
    }
}

const StyledHeader = withStyles(styles)(Header);
export { StyledHeader as Header };
