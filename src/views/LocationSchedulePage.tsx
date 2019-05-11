// Copyright 2019 Peter Beverloo. All rights reserved.
// Use of this source code is governed by the MIT license, a copy of which can
// be found in the LICENSE file.

import React from 'react';
import moment from 'moment';

import Clock from '../app/Clock';
import { Floor } from '../app/Floor';
import { LabeledSessionList } from '../components/LabeledSessionList';
import { Location } from '../app/Location';
import { TimedListItem, TimedListItemProps } from '../components/TimedListItem';
import { kDrawerWidth } from '../config';

import Avatar from '@material-ui/core/Avatar';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';
import Paper from '@material-ui/core/Paper';
import SvgIcon from '@material-ui/core/SvgIcon';
import { Theme } from '@material-ui/core/styles/createMuiTheme';
import createStyles from '@material-ui/core/styles/createStyles';
import withStyles, { WithStyles } from '@material-ui/core/styles/withStyles';

const styles = (theme: Theme) =>
    createStyles({
        maximumWidthHeader: {
            maxWidth: '100vw',
            [theme.breakpoints.up('sm')]: {
                // Take away an extra 17px to compensate for the scrollbar that's always visible.
                maxWidth: 'calc(100vw - 17px - ' + kDrawerWidth + 'px)',
            },
            marginBottom: theme.spacing(2),
        },
        noWrap: {
            overflow: 'hidden',
            textOverflow: 'ellipsis',
        },
    });

/**
 * Properties accepted by the <LocationSchedulePage> element.
 */
interface Properties {
    /**
     * Clock used to determine the active and upcoming sessions for this page.
     */
    clock: Clock;

    /**
     * The location for which this page is being rendered.
     */
    location: Location;
}

/**
 * TimedListItemProps, with a `key` field to ensure uniqueness in the list.
 */
type SessionDisplayInfo = TimedListItemProps & { key: string };

/**
 * Information necessary to render a section containing sessions for a particular day.
 */
interface SessionDayDisplayInfo {
    /**
     * Title identifying the day during which these sessions will take place.
     */
    label: string;

    /**
     * Array with the sessions that will take place on this day. Must be sorted.
     */
    sessions: SessionDisplayInfo[];

    /**
     * UNIX timestamp of the time at which this day starts.
     */
    timestamp: number;
}

/**
 * Information necessary to render the header of the location page.
 */
interface HeaderDisplayInfo {
    /**
     * Link to a reference contained in an SVG file to display as the icon for this location.
     */
    icon?: string;

    /**
     * Colour to render the icon in. Must be set when |icon| is given.
     */
    iconColor?: string;

    /**
     * Second line to display as part of the header for this location.
     */
    subtitle: string;

    /**
     * First line to display as part of the header for this location.
     */
    title: string;
}

/**
 * State of the <LocationSchedulePage> element. Will be updated on navigation, and periodically when
 * the state of one of the events in this location is changing.
 */
interface State {
    /**
     * Information necessary to render the header of the location page.
     */
    header: HeaderDisplayInfo;

    /**
     * Array of the various days during which sessions will take place in this location.
     */
    days: SessionDayDisplayInfo[];
}

/**
 * The location page displays an overview of a particular location, focused on the events that will
 * take place in that location. Events with volunteer coverage will be highlighted.
 */
class LocationSchedulePage extends React.Component<Properties & WithStyles<typeof styles>, State> {
    state: State = {
        header: {
            subtitle: '',
            title: '',
        },
        days: []
    };

    /**
     * Called when the component mounts or updates, to compute the state. This will trigger React to
     * request a re-render of the element and the displayed information.
     */
    static getDerivedStateFromProps(props: Properties) {
        const { clock, location } = props;
        const { floor, sessions } = location;

        const currentTime = clock.getMoment();

        // Compile the information necessary to display the header.
        const floorIdentifier = LocationSchedulePage.getFloorDescription(floor);
        const sessionCount = sessions.length + ' session' + (sessions.length !== 1 ? 's' : '');

        const days: Map<number, SessionDayDisplayInfo> = new Map();
        const header = {
            icon: floor.icon,
            iconColor: floor.iconColor,
            subtitle: floorIdentifier + ' — ' + sessionCount,
            title: location.label,
        };

        for (const session of sessions) {
            const state = session.beginTime > currentTime
                              ? 'pending'
                              : (session.endTime < currentTime ? 'past' : 'active');

            const sessionDisplayInfo: SessionDisplayInfo = {
                beginTime: session.beginTime,
                endTime: session.endTime,
                description: session.description || undefined,
                internal: session.event.internal,
                state: state,
                title: session.name,

                // The key for this |session| will be the event ID together with the begin time of
                // the session on the schedule. This should hopefully be globally unique.
                key: `${session.event.id}-${session.beginTime.unix()}`,
            };

            // Gets an identifier for the current day consistent throughout the sessions. A UNIX
            // timestamp is used rather than a Moment instance as Map can store multiple of those.
            const dayIdentifier = moment(session.beginTime).startOf('day').unix();
            const day = days.get(dayIdentifier);

            if (day) {
                day.sessions.push(sessionDisplayInfo);
            } else {
                days.set(dayIdentifier, {
                    label: session.beginTime.format('dddd'),
                    sessions: [ sessionDisplayInfo ],
                    timestamp: dayIdentifier,
                });
            }
        }

        // (1) Sort the days that are to be displayed on the location page.
        const sortedDays = Array.from(days.values()).sort((lhs, rhs) => {
            // TODO: Sort past days to the bottom of the list.
            return lhs.timestamp > rhs.timestamp ? 1 : -1;
        });

        // (2) Sort the events within the days that will be displayed on the page.
        for (const displayInfo of sortedDays) {
            displayInfo.sessions.sort((lhs, rhs) => {
                if (rhs.endTime < currentTime && lhs.endTime >= currentTime)
                    return -1;

                return lhs.beginTime > rhs.beginTime ? 1 : -1;
            });
        }

        return { header, days: sortedDays };
    }

    /**
     * Returns a textual description of where the volunteer might be able to find the |floor|.
     */
    private static getFloorDescription(floor: Floor): string {
        const ordinalIndicators = ['st', 'nd', 'rd'];
        let floorIndicator = null;

        switch (floor.id) {
            case 0:
                floorIndicator = 'ground';
                break;
            default:
                // https://community.shopify.com/c/Shopify-Design/Ordinal-Number-in-javascript-1st-2nd-3rd-4th/m-p/72156
                floorIndicator =
                    floor.id + ordinalIndicators[((floor.id + 90) % 100 - 10) % 10 - 1] || 'th';
                break;
        }

        return floor.label + ' (' + floorIndicator + ' floor)';
    }

    render() {
        const { classes } = this.props;
        const { header, days } = this.state;

        return (
            <React.Fragment>

                <Paper className={classes.maximumWidthHeader} square>
                    <List>
                        <ListItem>

                            { header.icon &&
                                <ListItemAvatar>
                                    <Avatar style={{ backgroundColor: header.iconColor }}>
                                        <SvgIcon htmlColor="white">
                                            <use xlinkHref={header.icon} />
                                        </SvgIcon>
                                    </Avatar>
                                </ListItemAvatar>}

                            <ListItemText className={classes.noWrap}
                                          primary={header.title}
                                          primaryTypographyProps={{ noWrap: true }}
                                          secondary={header.subtitle}
                                          secondaryTypographyProps={{ noWrap: true }} />

                        </ListItem>
                    </List>
                </Paper>

                { days.map(day =>
                    <LabeledSessionList key={day.label} label={day.label}>

                        { day.sessions.map(session =>
                            <TimedListItem {...session} /> )}

                    </LabeledSessionList>
                ) }

            </React.Fragment>
        );
    }
}

const StyledLocationSchedulePage = withStyles(styles)(LocationSchedulePage);
export { StyledLocationSchedulePage as LocationSchedulePage };
