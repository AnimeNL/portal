// Copyright 2019 Peter Beverloo. All rights reserved.
// Use of this source code is governed by the MIT license, a copy of which can
// be found in the LICENSE file.

import React from 'react';
import clsx from 'clsx';
import moment from 'moment';

import HistoryIcon from '@material-ui/icons/History';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import { Theme } from '@material-ui/core/styles/createMuiTheme';
import createStyles from '@material-ui/core/styles/createStyles';
import withStyles, { WithStyles } from '@material-ui/core/styles/withStyles';

const styles = (theme: Theme) =>
    createStyles({
        noWrap: {
            overflow: 'hidden',
            textOverflow: 'ellipsis',
        },
        pastIcon: {
            fontSize: 'inherit',
            position: 'relative',
            left: theme.spacing(0.5),
            marginRight: theme.spacing(0.5),
            top: 2,
        },
        past: {
            color: theme.palette.text.disabled,
        },
    });

/**
 * Formats the time for a session (or shift) in a friendly way for displaying.
 */
export function formatTime(beginTime: moment.Moment, endTime: moment.Moment, today?: boolean): string {
    let differentDays = false;

    // The next "day" begins at one o'clock. This avoids a bunch of duplicate labels.
    if (beginTime.date() !== endTime.date()) {
        if ((beginTime.date() + 1) !== endTime.date() || endTime.hour() !== 0)
            differentDays = true;
    }

    const begin = beginTime.format((!!today ? '' : 'dddd ') + '\\f\\r\\o\\m HH:mm');
    const end = differentDays ? endTime.format('HH:mm \\o\\n dddd')
                                : endTime.format('HH:mm');

    return `${begin} until ${end}`;
};

/**
 * Properties for the <SessionListItem> component.
 */
export interface SessionListItemProps {
    /**
     * Time at which the item begins.
     */
    beginTime: moment.Moment;

    /**
     * Time at which the item finishes. Does not have to be on the same day as |beginTime|.
     */
    endTime: moment.Moment;

    /**
     * Whether this session happened in the past and should be marked as such.
     */
    past?: boolean;
}

/**
 * The <SessionListItem> component displays timing information of a given event.
 */
class SessionListItem extends React.Component<SessionListItemProps & WithStyles<typeof styles>> {
    render() {
        const { classes, beginTime, endTime, past } = this.props;

        const title = formatTime(beginTime, endTime);
        const historyIcon = past ? <HistoryIcon className={classes.pastIcon} />
                                 : <></>;

        return (
            <ListItem>
                <ListItemText className={clsx(classes.noWrap, past && classes.past)}
                              primaryTypographyProps={{ noWrap: true }}>
                    {title}
                    {historyIcon}
                </ListItemText>
            </ListItem>
        );
    }
}

const StyledSessionListItem = withStyles(styles)(SessionListItem);
export { StyledSessionListItem as SessionListItem };
