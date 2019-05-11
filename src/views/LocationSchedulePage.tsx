// Copyright 2019 Peter Beverloo. All rights reserved.
// Use of this source code is governed by the MIT license, a copy of which can
// be found in the LICENSE file.

import React from 'react';
import moment from 'moment';

import Clock from '../app/Clock';
import { Floor } from '../app/Floor';
import { Location } from '../app/Location';
import { kDrawerWidth } from '../config';
import TimedListItem from '../components/TimedListItem';

import Avatar from '@material-ui/core/Avatar';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Paper from '@material-ui/core/Paper';
import SvgIcon from '@material-ui/core/SvgIcon';
import { Theme } from '@material-ui/core/styles/createMuiTheme';
import Typography from '@material-ui/core/Typography';
import createStyles from '@material-ui/core/styles/createStyles';
import grey from '@material-ui/core/colors/grey';
import withStyles, { WithStyles } from '@material-ui/core/styles/withStyles';

const styles = (theme: Theme) =>
    createStyles({
        maximumWidthHeader: {
            maxWidth: '100vw',
            [theme.breakpoints.up('sm')]: {
                // Take away an extra 17px to compensate for the scrollbar that's always visible.
                maxWidth: 'calc(100vw - 17px - ' + kDrawerWidth + 'px)',
            },
            marginBottom: theme.spacing.unit * 2,
        },
        sessionName: {
            fontWeight: 'bold',
        },
        sessionDescription: {
            color: grey[600],
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
        },
        internalIcon: {
            marginRight: theme.spacing.unit / 2,
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
 * Information required to render an individual session on this page.
 */
interface SessionDisplayInfo {
    /**
     * Time at which the session will commence.
     */
    beginTime: moment.Moment;

    /**
     * Time at which the session will be finished. Does not have to be on the same day as the
     * |beginTime|.
     */
    endTime: moment.Moment;

    /**
     * Textual description of the session. May be tripped to fit display needs. Optional.
     */
    description?: string;

    /**
     * Whether this session is internal, which means it hasn't been announced to visitors.
     */
    internal?: boolean;

    /**
     * Title identifying this particular session.
     */
    title: string;
}

/**
 * Information necessary to render a section containing sessions for a particular day.
 */
interface SessionDayDisplayInfo {
    /**
     * Title identifying the day during which these sessions will take place.
     */
    title: string;

    /**
     * Array with the sessions that will take place on this day. Must be sorted.
     */
    sessions: SessionDisplayInfo[];
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
        const { location } = props;
        const { floor, sessions } = location;

        // Compile the information necessary to display the header.
        const floorIdentifier = LocationSchedulePage.getFloorDescription(floor);
        const sessionCount = sessions.length + ' session' + (sessions.length !== 1 ? 's' : '');

        const header = {
            icon: floor.icon,
            iconColor: floor.iconColor,
            subtitle: floorIdentifier + ' — ' + sessionCount,
            title: location.label,
        };

        // TODO: Split up the |days| in several days.
        // TODO: Sort the sessions by start time.

        const firstDay: SessionDayDisplayInfo = {
            title: 'Weekend',
            sessions: []
        };

        for (const session of sessions) {
            firstDay.sessions.push({
                beginTime: session.beginTime,
                endTime: session.endTime,
                description: session.description || undefined,
                internal: session.event.internal,
                title: session.name,
            });
        }

        return { header, days: [ firstDay ] };
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
                                <Avatar style={{ backgroundColor: header.iconColor }}>
                                    <SvgIcon nativeColor="white">
                                        <use xlinkHref={header.icon} />
                                    </SvgIcon>
                                </Avatar> }

                            <ListItemText primary={header.title}
                                          primaryTypographyProps={{ noWrap: true }}
                                          secondary={header.subtitle}
                                          secondaryTypographyProps={{ noWrap: true }} />

                        </ListItem>
                    </List>
                </Paper>

                { days.map(day =>
                    <Paper className={classes.maximumWidthHeader} square>
                        <h1>{day.title}</h1>
                        <List>

                            { day.sessions.map(session => {
                                return (
                                    <TimedListItem className="" beginTime={session.beginTime}
                                                   endTime={session.endTime}>

                                        <Typography className={classes.sessionName}>
                                            {session.title}
                                        </Typography>

                                        <Typography className={classes.sessionDescription}>
                                            {session.description}
                                        </Typography>

                                    </TimedListItem>
                                );
                            }) }

                        </List>
                    </Paper>
                ) }

            </React.Fragment>
        );
    }
}

const StyledLocationSchedulePage = withStyles(styles)(LocationSchedulePage);
export { StyledLocationSchedulePage as LocationSchedulePage };
