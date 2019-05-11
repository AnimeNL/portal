// Copyright 2019 Peter Beverloo. All rights reserved.
// Use of this source code is governed by the MIT license, a copy of which can
// be found in the LICENSE file.

import React from 'react';
import moment from 'moment';

import Grid from '@material-ui/core/Grid';
import ListItem from '@material-ui/core/ListItem';
import { Theme } from '@material-ui/core/styles/createMuiTheme';
import Typography from '@material-ui/core/Typography';
import createStyles from '@material-ui/core/styles/createStyles';
import withStyles, { WithStyles } from '@material-ui/core/styles/withStyles';

const styles = (theme: Theme) =>
    createStyles({
        timesItem: {
            marginRight: theme.spacing(1),
            textAlign: 'right',
        },
    });

/**
 * Properties accepted by the <TimedListItem> element.
 */
interface Properties {
    /**
     * The begin time of the item
     */
    beginTime: moment.Moment;

    /**
     * The end time of the item
     */
    endTime: moment.Moment;

    /**
     * @ignore
     */
    className: string;

    /**
     * The <TimedListItem> element accepts children.
     * TypeScript requires us to be explicit.
     */
    children?: React.ReactNode;
}

/**
 * The <TimedListItem> element represents an item that has a starting and
 * ending time.
 */
class TimedListItem extends React.Component<Properties & WithStyles<typeof styles>> {
    render() {
        const { beginTime, endTime, className, children, classes, } = this.props;

        return (
            <ListItem className={className}>
                <Grid container>
                    <Grid item className={classes.timesItem}>
                        <Typography>{beginTime.format('HH:mm')}</Typography>
                        <Typography>{endTime.format('HH:mm')}</Typography>
                    </Grid>
                    <Grid item xs zeroMinWidth>
                        {children}
                    </Grid>
                </Grid>
            </ListItem>
        );
    }
}

export default withStyles(styles)(TimedListItem);
