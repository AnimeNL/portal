// Copyright 2019 Peter Beverloo. All rights reserved.
// Use of this source code is governed by the MIT license, a copy of which can
// be found in the LICENSE file.

import { Link } from 'react-router-dom';
import React from 'react';
import clsx from 'clsx';
import moment from 'moment';

import { Volunteer } from '../app/Volunteer';
import { formatTime } from './SessionListItem';
import slug from '../app/util/Slug';

import Avatar from '@material-ui/core/Avatar';
import HistoryIcon from '@material-ui/icons/History';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';
import { Theme } from '@material-ui/core/styles/createMuiTheme';
import createStyles from '@material-ui/core/styles/createStyles';
import withStyles, { WithStyles } from '@material-ui/core/styles/withStyles';

// Helper function to select the first name of a particular volunteer.
const firstName = (volunteer: Volunteer) => volunteer.name.replace(/\s+.*/, '');

// Naive algorithm for getting the initials for a particular name: selecting the first and the last
// capital available in the name.
const nameInitials = (name: string) =>
    name.replace(/[^A-Z]/g, '').replace(/^(.).*(.)/g, '$1$2');

const styles = (theme: Theme) =>
    createStyles({
        link: {
            textDecoration: 'none',
            color: 'inherit',
        },

        active: { ...theme.activeSessionStyle },
        root: {
            padding: theme.spacing(1.5, 2),
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
            '& img': {
                filter: 'grayscale(80%)',
            },
        },
    });

/**
 * Properties accepted by the <ShiftListItem> component.
 */
export interface ShiftListItemProps {
    /**
     * Time at which the shift begins.
     */
    beginTime: moment.Moment;

    /**
     * Time at which the shift finishes. Does not have to be on the same day as |beginTime|.
     */
    endTime: moment.Moment;

    /**
     * Whether the shift is currently active.
     */
    active?: boolean;

    /**
     * Whether the shift happened in the past.
     */
    past?: boolean;

    /**
     * Whether the event is happening on the current day.
     */
    today?: boolean;

    /**
     * The Volunteer who will be working on this shift.
     */
    volunteer: Volunteer;
}

type Properties = ShiftListItemProps & WithStyles<typeof styles>;

/**
 * The <ShiftListItem> component displays a shift to be managed by an individual volunteer. Display
 * depends on whether the shift is in the past, active or in the future.
 */
class ShiftListItem extends React.PureComponent<Properties> {
    render() {
        const { active, beginTime, classes, endTime, past, today, volunteer } = this.props;

        const to = '/volunteers/' + slug(volunteer.name);

        // Duration of the shift, formatted consistent with the session rows.
        const shiftDuration = formatTime(beginTime, endTime, today);

        // Used to mark shifts that happened in the past as such.
        const historyIcon = past ? <HistoryIcon className={classes.pastIcon} />
                                 : <></>;

        return (
            <Link className={classes.link} to={to}>
                <ListItem button divider
                          className={clsx(classes.root, active && classes.active, past && classes.past)}>

                    <ListItemAvatar>
                        <Avatar src={volunteer.avatar}>
                            {nameInitials(volunteer.name)}
                        </Avatar>
                    </ListItemAvatar>

                    <ListItemText primaryTypographyProps={{ noWrap: true }}>
                        <strong>{firstName(volunteer)}</strong>, {shiftDuration}
                        {historyIcon}
                    </ListItemText>

                </ListItem>
            </Link>
        )
    }
}

const StyledShiftListItem = withStyles(styles)(ShiftListItem);
export { StyledShiftListItem as ShiftListItem };
