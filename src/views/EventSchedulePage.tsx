// Copyright 2019 Peter Beverloo. All rights reserved.
// Use of this source code is governed by the MIT license, a copy of which can
// be found in the LICENSE file.

import React from 'react';

import Clock from '../app/Clock';
import { ProgramEvent } from '../app/ProgramEvent';
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
 * Properties accepted by the <EventSchedulePage> component.
 */
interface Properties {
    /**
     * Clock used to determine the active and upcoming sessions for this page.
     */
    clock: Clock;

    /**
     * The event for which this page is being rendered.
     */
    event: ProgramEvent;
}

/**
 * Information necessary to render the header of the events page.
 */
interface HeaderDisplayInfo {
    /**
     * Link to a reference contained in an SVG file to display as the icon for this event.
     */
    icon?: string;

    /**
     * Colour to render the icon in. Must be set when |icon| is given.
     */
    iconColor?: string;

    /**
     * Second line to display as part of the header for this event.
     */
    subtitle: string;

    /**
     * First line to display as part of the header for this event.
     */
    title: string;
}

/**
 * State of the event schedule page. Details both the header as the content that should be displayed
 * on the page, such as sessions and shifts w/ volunteers.
 */
interface State {
    /**
     * Details required to display the page header.
     */
    header: HeaderDisplayInfo;
}

/**
 * The event schedule page displays more information about an event, the information that's known
 * about it, as well as the sessions and volunteer shifts scheduled at it.
 */
class EventSchedulePage extends React.Component<Properties & WithStyles<typeof styles>, State> {
    state: State = {
        header: {
            subtitle: '',
            title: '',
        }
    }

    /**
     * Called when the component mounts or updates, to compute the state. This will trigger React to
     * request a re-render of the element and the displayed information.
     */
    static getDerivedStateFromProps(props: Properties) {
        const { event } = props;

        const firstSession = event.sessions[0];
        const firstSessionFloor = firstSession.location.floor;

        // Compile the information that's to be displayed in the page header.
        // TODO: Add a location description to the subtitle.
        const header: HeaderDisplayInfo = {
            icon: firstSessionFloor.icon || undefined,
            iconColor: firstSessionFloor.iconColor,
            subtitle: '',
            title: firstSession.name,
        };

        return { header };
    }

    render() {
        const { classes } = this.props;
        const { header } = this.state;

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

            </React.Fragment>
        );
    }
}

const StyledEventSchedulePage = withStyles(styles)(EventSchedulePage);
export { StyledEventSchedulePage as EventSchedulePage };
