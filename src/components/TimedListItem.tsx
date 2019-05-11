// Copyright 2019 Peter Beverloo. All rights reserved.
// Use of this source code is governed by the MIT license, a copy of which can
// be found in the LICENSE file.

import React from 'react';
import moment from 'moment';

import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import { Theme } from '@material-ui/core/styles/createMuiTheme';
import createStyles from '@material-ui/core/styles/createStyles';
import withStyles, { WithStyles } from '@material-ui/core/styles/withStyles';

const styles = (theme: Theme) =>
    createStyles({
        dateDifference: {
            color: 'red',
            fontSize: 9,
            verticalAlign: 'top',
        },

        times: {
            minWidth: 56,
        },

        timesItem: {
            marginRight: theme.spacing(1),
            textAlign: 'right',
        },
    });

/**
 * Properties accepted by the <TimedListItem> element.
 */
export interface TimedListItemProps {
    /**
     * Time at which the item begins.
     */
    beginTime: moment.Moment;

    /**
     * Description of the item that's being displayed in the TimedListItem.
     */
    description?: string;

    /**
     * Time at which the item finishes. Does not have to be on the same day as |beginTime|.
     */
    endTime: moment.Moment;

    /**
     * Whether this session is internal, which means it hasn't been announced to visitors.
     */
    internal?: boolean;

    /**
     * Title of the item that's being displayed in this item.
     */
    title: string;
}

/**
 * The <TimedListItem> element represents an item that has a starting and ending time.
 */
class TimedListItem extends React.Component<TimedListItemProps & WithStyles<typeof styles>> {
    /**
     * Returns an indicator that tells the user that the |endTime| is on a different day than the
     * |beginTime| when this is the case, or an empty fragment otherwise.
     */
    renderDifference(beginTime: moment.Moment, endTime: moment.Moment): JSX.Element {
        const beginDay = moment(beginTime).startOf('day');
        const endDay = moment(endTime).startOf('day');

        const diff = endDay.diff(beginDay, 'days');
        if (!diff)
            return <></>

        const { classes } = this.props;

        return <span className={classes.dateDifference}>+{diff}</span>;
    }


    render() {
        const { beginTime, classes, description, endTime, title } = this.props;

        return (
            <ListItem divider>

                <div className={classes.times}>
                    {beginTime.format('HH:mm')}–<br />
                    {endTime.format('HH:mm')}
                    {this.renderDifference(beginTime, endTime)}
                </div>

                <ListItemText primary={title}
                              primaryTypographyProps={{ noWrap: true }}
                              secondary={description}
                              secondaryTypographyProps={{ noWrap: true }} />

            </ListItem>
        );
    }
}

const StyledTimedListItem = withStyles(styles)(TimedListItem);
export { StyledTimedListItem as TimedListItem };
