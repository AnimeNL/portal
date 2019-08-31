// Copyright 2019 Peter Beverloo. All rights reserved.
// Use of this source code is governed by the MIT license, a copy of which can
// be found in the LICENSE file.

import React from 'react';
import { Link } from 'react-router-dom';

import Divider from '@material-ui/core/Divider';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import PeopleIcon from '@material-ui/icons/PeopleOutlined';
import { Theme } from '@material-ui/core/styles/createMuiTheme';
import Typography from '@material-ui/core/Typography';
import { WithStyles, default as withStyles } from '@material-ui/core/styles/withStyles';
import createStyles from '@material-ui/core/styles/createStyles';

const styles = (theme: Theme) =>
    createStyles({
        removeVerticalPadding: { paddingBottom: 0, paddingTop: 0 },

        root: {
            padding: theme.spacing(2),
        }
    });

/**
 * The Welcome view is what users are presented with when they visit the portal's root without
 * having access to the schedule application.
 */
class WelcomeViewBase extends React.PureComponent<WithStyles<typeof styles>> {
    render() {
        const { classes } = this.props;

        return (
            <>
                <Typography variant="body1" component="p" className={classes.root}>
                    Text goes here.
                </Typography>

                <Divider />
                <List className={classes.removeVerticalPadding}>
                    <ListItem component={Link} to="/registration/" button divider>
                        <ListItemIcon>
                            <PeopleIcon />
                        </ListItemIcon>
                        <ListItemText primary="Vrijwilliger worden?" />
                    </ListItem>
                    <ListItem component="a" href="https://animecon.nl/" button>
                        <ListItemIcon>
                            <ExitToAppIcon />
                        </ListItemIcon>
                        <ListItemText primary="AnimeCon website…" />
                    </ListItem>
                </List>
            </>
        );
    }
}

export const WelcomeView = withStyles(styles)(WelcomeViewBase);
