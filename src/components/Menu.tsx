// Copyright 2019 Peter Beverloo. All rights reserved.
// Use of this source code is governed by the MIT license, a copy of which can
// be found in the LICENSE file.

import React from 'react';
import bind from 'bind-decorator';

import Divider from '@material-ui/core/Divider';
import { Theme } from '@material-ui/core/styles/createMuiTheme';
import Typography from '@material-ui/core/Typography';
import createStyles from '@material-ui/core/styles/createStyles';
import withStyles, { WithStyles } from '@material-ui/core/styles/withStyles';

const styles = (theme: Theme) =>
    createStyles({
        grow: {},
        toolbar: theme.mixins.toolbar,
    });

class Menu extends React.Component<WithStyles<typeof styles>> {
    render() {
        const { classes } = this.props;

        return (

            <div>

                <div className={classes.toolbar}>
                    <Typography variant="h6" color="inherit" className={classes.grow}>
                        Hello
                    </Typography>
                </div>

                <Divider />

                <Typography variant="h6" color="inherit" className={classes.grow}>
                    Items
                </Typography>

            </div>

        );
    }
}

export default withStyles(styles)(Menu);
