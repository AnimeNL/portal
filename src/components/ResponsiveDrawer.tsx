// Copyright 2019 Peter Beverloo. All rights reserved.
// Use of this source code is governed by the MIT license, a copy of which can
// be found in the LICENSE file.

import React from 'react';
import bind from 'bind-decorator';

import { MenuNotifier, MenuObserver } from '../state/MenuNotifier';
import { kDrawerWidth } from '../config';

import Divider from '@material-ui/core/Divider';
import Drawer from '@material-ui/core/Drawer';
import Hidden from '@material-ui/core/Hidden';
import { Theme } from '@material-ui/core/styles/createMuiTheme';
import createStyles from '@material-ui/core/styles/createStyles';
import withStyles, { WithStyles } from '@material-ui/core/styles/withStyles';

const styles = (theme: Theme) =>
    createStyles({
        drawer: {
            [theme.breakpoints.up('sm')]: {
                width: kDrawerWidth,
                flexShrink: 0,
            },
        },
        drawerPaper: {
            width: kDrawerWidth,
            [theme.breakpoints.up('sm')]: {
                // https://github.com/mui-org/material-ui/blob/next/packages/material-ui/src/styles/createMixins.js
                paddingTop: (theme.mixins.toolbar.minHeight as number) + theme.spacing(1)
            },
        },
        toolbar: theme.mixins.toolbar,
    });

/**
 * State for the <ResponsiveDrawer> component.
 */
interface State {
    /**
     * Whether the main menu should be opened.
     */
    open: boolean;
}

/**
 * The <ResponsiveDrawer> element is a drawer that's opened by default for wide-screen users, but
 * has to be manually toggled for small-screen users. The children of this element will be displayed
 * as the drawer's contents, usually a menu.
 *
 * @see https://material-ui.com/demos/drawers/
 */
class ResponsiveDrawer extends React.Component<WithStyles<typeof styles>, State> implements MenuObserver {
    state: State = {
        open: false,
    };

    componentWillMount() {
        MenuNotifier.addObserver(this);
    }

    componentWillUnmount() {
        MenuNotifier.removeObserver(this);
    }

    /**
     * Called when the main menu should toggle.
     */
    update(open: boolean): void {
        if (this.state.open === open)
            return;

        this.setState({ open });
    }

    /**
     * Called when the main menu is closing because of <Drawer> component logic, e.g. clicking on
     * the full-page backdrop next to the drawer.
     */
    @bind
    onMenuClose(): void {
        this.update(/* open= */ false);
    }

    render() {
        const { children, classes } = this.props;
        const { open } = this.state;

        return (
            <nav className={classes.drawer}>
                <Hidden smUp implementation="css">
                    <Drawer
                        anchor="left"
                        classes={{ paper: classes.drawerPaper }}
                        ModalProps={{ keepMounted: true }}
                        onClose={this.onMenuClose}
                        variant="temporary"
                        open={open}>

                            <div className={classes.toolbar} />

                            <Divider />

                            {children}

                    </Drawer>
                </Hidden>
                <Hidden xsDown implementation="css">
                    <Drawer
                        anchor="left"
                        classes={{ paper: classes.drawerPaper }}
                        variant="permanent"
                        open>

                        {children}

                    </Drawer>
                </Hidden>
            </nav>
        );
    }
}

export default withStyles(styles)(ResponsiveDrawer);
