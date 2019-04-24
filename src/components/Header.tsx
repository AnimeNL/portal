// Copyright 2019 Peter Beverloo. All rights reserved.
// Use of this source code is governed by the MIT license, a copy of which can
// be found in the LICENSE file.

import React from 'react';

import AppBar from '@material-ui/core/AppBar';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import createStyles from '@material-ui/core/styles/createStyles';
import withStyles, { WithStyles } from '@material-ui/core/styles/withStyles';

const styles = () =>
    createStyles({
        grow: {
            flexGrow: 1,
        },
        menuButton: {
            marginLeft: -12,
            marginRight: 20,
        },
        overflowButton: {
            marginRight: -12
        },
    });

/**
 * Properties accepted by the <Header> element.
 */
interface Properties extends WithStyles<typeof styles> {
    /**
     * Title that should be displayed on the header bar.
     */
    title: string;

    /**
     * Whether the Debug menu item should be displayed in the overflow menu.
     */
    enableDebug?: boolean;
};

class Header extends React.Component<Properties> {
    render() {
        const { classes, title } = this.props;

        return (
            <AppBar position="static">
                <Toolbar>

                    <IconButton className={classes.menuButton} color="inherit" aria-label="Menu">
                        <MenuIcon />
                    </IconButton>

                    <Typography variant="h6" color="inherit" className={classes.grow}>
                        {title}
                    </Typography>

                    <div>
                        <IconButton
                            aria-label="More"
                            aria-haspopup="true"
                            className={classes.overflowButton}
                            color="inherit">

                            <MoreVertIcon />

                        </IconButton>
                    </div>

                </Toolbar>
            </AppBar>
        )
    }
}

export default withStyles(styles)(Header);
