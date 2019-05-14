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
        noWrap: {
            overflow: 'hidden',
            textOverflow: 'ellipsis',
        },
    });

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
}

/**
 * The <SessionListItem> component displays timing information of a given event.
 */
class SessionListItem extends React.Component<SessionListItemProps & WithStyles<typeof styles>> {
    render() {
        const { classes, beginTime, endTime } = this.props;

        let differentDays = false;

        // The next "day" begins at one o'clock. This avoids a bunch of duplicate labels.
        if (beginTime.date() !== endTime.date()) {
            if ((beginTime.date() + 1) !== endTime.date() || endTime.hour() !== 0)
                differentDays = true;
        }

        const begin = beginTime.format('dddd \\f\\r\\o\\m HH:mm');
        const end = differentDays ? endTime.format('HH:mm \\o\\n dddd')
                                  : endTime.format('HH:mm');

        const title = `${begin} until ${end}`;

        return (
            <ListItem>
                <ListItemText className={classes.noWrap}
                              primary={title}
                              primaryTypographyProps={{ noWrap: true }} />
            </ListItem>
        );
    }
}

const StyledSessionListItem = withStyles(styles)(SessionListItem);
export { StyledSessionListItem as SessionListItem };
