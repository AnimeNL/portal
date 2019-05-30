// Copyright 2019 Peter Beverloo. All rights reserved.
// Use of this source code is governed by the MIT license, a copy of which can
// be found in the LICENSE file.

import React from 'react';
import moment from 'moment';

import ConditionalLink from './ConditionalLink';
import ConditionalListItem from './ConditionalListItem';

import HistoryIcon from '@material-ui/icons/History';
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
        noWrap: {
            overflow: 'hidden',
            textOverflow: 'ellipsis',
        },
        link: {
            textDecoration: 'none',
            color: 'inherit',
        },

        times: {
            minWidth: 56,
        },

        past: {
            ...theme.pastSessionStyle,

            paddingTop: 0,
            paddingBottom: 0,
            minHeight: 36,
        },
        active: { ...theme.activeSessionStyle },
        pending: {},

        timesItem: {
            marginRight: theme.spacing(1),
            textAlign: 'right',
        },

        titleIcon: {
            fontSize: 'inherit',
            position: 'relative',
            left: theme.spacing(0.5),
            top: 2,
        }
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
     * State of the event, so that the visual representation can be personalized.
     */
    state: "past" | "active" | "pending";

    /**
     * Title of the item that's being displayed in this item.
     */
    title: string;

    /**
     * URL of the page the user should be navigating to after clicking on this item.
     */
    to?: string;
}

/**
 * The <TimedListItem> element represents an item that has a starting and ending time.
 */
class TimedListItem extends React.PureComponent<TimedListItemProps & WithStyles<typeof styles>> {
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
        const { beginTime, classes, endTime, state, to } = this.props;

        let times: JSX.Element | undefined;
        let title: string = this.props.title;
        let titleIcon: JSX.Element | undefined;
        let description: string | undefined;

        switch (state) {
            case 'past':
                times = <>{beginTime.format('HH:mm')}</>;
                titleIcon = <HistoryIcon className={classes.titleIcon} />;
                break;

            case 'active':
            case 'pending':
                times = <React.Fragment>
                            {beginTime.format('HH:mm')}–<br />
                            {endTime.format('HH:mm')}
                            {this.renderDifference(beginTime, endTime)}
                        </React.Fragment>;

                description = this.props.description;
                break;
        }


        return (
            <ConditionalLink className={classes.link} to={to}>
                <ConditionalListItem className={classes[state]} button={!!to} divider>

                    <div className={classes.times}>
                        {times}
                    </div>

                    <ListItemText className={classes.noWrap}
                                  primaryTypographyProps={{ noWrap: true }}
                                  secondary={description}
                                  secondaryTypographyProps={{ noWrap: true }}>
                        {title}
                        {titleIcon}
                    </ListItemText>

                </ConditionalListItem>
            </ConditionalLink>
        );
    }
}

const StyledTimedListItem = withStyles(styles)(TimedListItem);
export { StyledTimedListItem as TimedListItem };
