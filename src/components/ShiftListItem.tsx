// Copyright 2019 Peter Beverloo. All rights reserved.
// Use of this source code is governed by the MIT license, a copy of which can
// be found in the LICENSE file.

import { Link } from 'react-router-dom';
import React from 'react';
import clsx from 'clsx';
import moment from 'moment';

import { Volunteer } from '../app/Volunteer';
import slug from '../app/util/Slug';

import HistoryIcon from '@material-ui/icons/History';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import { Theme } from '@material-ui/core/styles/createMuiTheme';
import createStyles from '@material-ui/core/styles/createStyles';
import withStyles, { WithStyles } from '@material-ui/core/styles/withStyles';

const styles = (theme: Theme) =>
    createStyles({
        link: {
            textDecoration: 'none',
            color: 'inherit',
        },
        active: {

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
        const { active, beginTime, classes, endTime, past, volunteer } = this.props;

        const to = '/volunteers/' + slug(volunteer.name);

        const historyIcon = past ? <HistoryIcon className={classes.pastIcon} />
                                 : <></>;

        return (
            <Link className={classes.link} to={to}>
                <ListItem button divider className={clsx(active && classes.active, past && classes.past)}>
                    <ListItemText primaryTypographyProps={{ noWrap: true }}>
                        {volunteer.name}, {beginTime.format('HH:mm')} until {endTime.format('HH:mm')}
                        {historyIcon}
                    </ListItemText>
                </ListItem>
            </Link>
        )
    }
}

const StyledShiftListItem = withStyles(styles)(ShiftListItem);
export { StyledShiftListItem as ShiftListItem };
