// Copyright 2019 Peter Beverloo. All rights reserved.
// Use of this source code is governed by the MIT license, a copy of which can
// be found in the LICENSE file.

import React from 'react';
import bind from 'bind-decorator';

import Drawer from '@material-ui/core/Drawer';
import createStyles from '@material-ui/core/styles/createStyles';
import withStyles, { WithStyles } from '@material-ui/core/styles/withStyles';

/**
 * Width of the drawer when opened, in pixels.
 */
const kDrawerWidth = 240;

const styles = () =>
    createStyles({
        drawer: {

        },
        drawerPaper: {
            width: kDrawerWidth
        },
    });

/**
 * Properties accepted by the <ResponsiveDrawer> element.
 */
interface Properties extends WithStyles<typeof styles> {
    /**
     * Whether the drawer should be opened. Only applicable to small-screen users.
     */
    open?: boolean;

    /**
     * Event to be invoked when the drawer is being closed. Will only be fired for small-screen
     * users as the drawer is always opened for large-screen users.
     */
    onClose: () => void;
}

/**
 * The <ResponsiveDrawer> element is a drawer that's opened by default for wide-screen users, but
 * has to be manually toggled for small-screen users. The children of this element will be displayed
 * as the drawer's contents, usually a menu.
 *
 * @see https://material-ui.com/demos/drawers/
 */
class ResponsiveDrawer extends React.Component<Properties> {
    /**
     * Called when the drawer should be closed. It's the responsibility of the hosting element to
     * change the `open` property of this <ResponsiveDrawer> to close.
     */
    @bind
    handleDrawerClose(): void {
        this.props.onClose();
    }

    render() {
        const { children, classes, open } = this.props;

        return (
            <nav className={classes.drawer}>
                <Drawer
                    anchor="left"
                    classes={{ paper: classes.drawerPaper }}
                    onClose={this.handleDrawerClose}
                    open={open}
                    variant="temporary">

                    {children}

                </Drawer>
            </nav>
        );
    }
}

export default withStyles(styles)(ResponsiveDrawer);
