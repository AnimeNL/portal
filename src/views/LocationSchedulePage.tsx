// Copyright 2019 Peter Beverloo. All rights reserved.
// Use of this source code is governed by the MIT license, a copy of which can
// be found in the LICENSE file.

import React from 'react';

import Clock from '../app/Clock';
import { Floor } from '../app/Floor';
import { Location } from '../app/Location';
import { kDrawerWidth } from '../config';
import { ProgramSession } from '../app/ProgramSession';
import TimedListItem from '../components/TimedListItem';

import Avatar from '@material-ui/core/Avatar';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import LockIcon from '@material-ui/icons/Lock';
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
 * The location page displays an overview of a particular location, focused on the events that will
 * take place in that location.
 */
class LocationSchedulePage extends React.Component<Properties & WithStyles<typeof styles>> {
    /**
     * Returns a textual description of the given |floor|.
     */
    private getFloorIdentifier(floor: Floor): string {
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
        const { classes, location } = this.props;

        const title = location.label;
        const description =
            this.getFloorIdentifier(location.floor) + ' — ' +
            location.sessions.length + ' session' + (location.sessions.length !== 1 ? 's' : '');

        return (
            <React.Fragment>

                <Paper className={classes.maximumWidthHeader} square>
                    <List>
                        <ListItem>
                            { location.floor.icon &&
                              <Avatar style={{ backgroundColor: location.floor.iconColor }}>
                                  <SvgIcon nativeColor="white">
                                      <use xlinkHref={location.floor.icon} />
                                  </SvgIcon>
                              </Avatar> }
                            <ListItemText primary={title}
                                          primaryTypographyProps={{ noWrap: true }}
                                          secondary={description}
                                          secondaryTypographyProps={{ noWrap: true }} />
                        </ListItem>
                    </List>
                </Paper>

                <Paper className={classes.maximumWidthHeader}>
                    <List>
                        { location.sessions.map((session: ProgramSession) => {
                            // TODO: Determine (background)color for this TimedLineItem
                            const className = "";

                            let internal: JSX.Element | null = null;
                            if (session.event.internal) {
                                internal = <LockIcon className={classes.internalIcon} fontSize="inherit" />;
                            }

                            return (
                                <TimedListItem beginTime={session.beginTime}
                                               endTime={session.endTime}
                                               className={className}>
                                    <Typography className={classes.sessionName}>
                                        {internal}{session.name}
                                    </Typography>
                                    <Typography className={classes.sessionDescription}>
                                        {session.description}
                                    </Typography>
                                </TimedListItem>
                            );
                        }) }
                    </List>
                </Paper>


            </React.Fragment>
        );
    }
}

const StyledLocationSchedulePage = withStyles(styles)(LocationSchedulePage);
export { StyledLocationSchedulePage as LocationSchedulePage };
