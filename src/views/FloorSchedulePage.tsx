// Copyright 2019 Peter Beverloo. All rights reserved.
// Use of this source code is governed by the MIT license, a copy of which can
// be found in the LICENSE file.

import { RouteComponentProps, withRouter } from 'react-router-dom';
import React from 'react';
import moment from 'moment';

import Clock from '../app/Clock';
import { Floor } from '../app/Floor';
import { Location } from '../app/Location';
import { ProgramSession } from '../app/ProgramSession';
import slug from '../app/util/Slug';

import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import Divider from '@material-ui/core/Divider';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import { Theme } from '@material-ui/core/styles/createMuiTheme';
import Typography from '@material-ui/core/Typography';
import createStyles from '@material-ui/core/styles/createStyles';
import grey from '@material-ui/core/colors/grey';
import withStyles, { WithStyles } from '@material-ui/core/styles/withStyles';

/**
 * Number of active sessions that will be displayed at most for a particular location.
 */
const kMaximumActiveSessions = 3;

const styles = (theme: Theme) =>
    createStyles({
        location: {
            margin: theme.spacing.unit * 2,
        },
        locationName: {
            // TODO: Make this work correctly on desktop.
            maxWidth: 'calc(100vw - ' + (4 * theme.spacing.unit) + 'px)',

            padding: theme.spacing.unit,
            fontWeight: 500,
        },
        activeSession: {
            // TODO: Styling for active sessions in the location card.
            color: 'red',
        },
        futureSession: {
            // TODO: Styling for future sessions in the location card.
            color: 'blue',
        },
        noSession: {
            color: grey[600],
        },
    });

/**
 * Properties accepted by the <FloorSchedulePage> element.
 */
interface Properties extends WithStyles<typeof styles> {
    /**
     * Clock used to determine the active and upcoming sessions for this page.
     */
    clock: Clock;

    /**
     * The floor for which this page is being displayed.
     */
    floor: Floor;
}

/**
 * Properties required to appropriately display a session on the location card.
 */
interface SessionDisplayInfo {
    /**
     * The program session that's about to be displayed on this page.
     */
    session: ProgramSession;

    /**
     * The class name that should be used to control presentation of this session.
     */
    className: string;
}

/**
 * The floor schedule page is responsible for displaying the locations available on a particular
 * floor, together with the events that are happening in them at the current time.
 */
class FloorSchedulePage extends React.Component<Properties & RouteComponentProps> {
    /**
     * Creates the selection of sessions that should be displayed for the given |location|. A
     * maximum of |kMaximumActiveSessions| will be returned, preferring active ones, then proceeding
     * with upcoming sessions. An empty array will be returned if there are no more sessions.
     */
    private createSessionSelectionForLocation(location: Location): SessionDisplayInfo[] {
        const { classes, clock } = this.props;

        const currentTime = clock.getMoment();
        const selection: SessionDisplayInfo[] = [];

        // Create a sorted list of all the sessions in the |location| by their starting time.
        const sessions = Array.from(location.sessions).sort((lhs, rhs) => {
            return lhs.beginTime > rhs.beginTime ? 1 : -1;
        });

        // Select the |kMaximumActiveSessions| first sessions that aren't in the past.
        for (const session of sessions) {
            if (session.endTime < currentTime)
                continue;

            const className = session.beginTime <= currentTime ? classes.activeSession
                                                               : classes.futureSession;

            selection.push({ session, className });

            if (selection.length >= kMaximumActiveSessions)
                break;
        }

        return selection;
    }

    render() {
        const { classes, floor, history } = this.props;

        // Create a sorted list (by label) of the locations on this floor.
        const locations = Array.from(floor.locations).sort((lhs, rhs) => {
            return lhs.label.localeCompare(rhs.label);
        });

        return (
            <React.Fragment>

                { locations.map((location: Location) => {

                    const path = '/schedule/locations/' + location.id + '/' + slug(location.label);
                    const sessions = this.createSessionSelectionForLocation(location);

                    return (
                        <Card className={classes.location}>
                            <CardActionArea onClick={() => history.push(path)}>

                                <Typography className={classes.locationName} noWrap variant="body2">
                                    {location.label}
                                </Typography>

                                <Divider />

                                <List dense>

                                    { sessions.map((displayInfo: SessionDisplayInfo) => {
                                        return (
                                            <ListItem className={displayInfo.className}>
                                                {displayInfo.session.name}
                                            </ListItem>
                                        );
                                    }) }

                                    { !sessions.length &&
                                        <ListItem className={classes.noSession}>
                                            <i>No more scheduled events in this location.</i>
                                        </ListItem>
                                    }

                                </List>

                            </CardActionArea>
                        </Card>
                    );

                }) }

            </React.Fragment>
        );
    }
}

const StyledFloorSchedulePage = withRouter(withStyles(styles)(FloorSchedulePage));
export { StyledFloorSchedulePage as FloorSchedulePage };
