// Copyright 2019 Peter Beverloo. All rights reserved.
// Use of this source code is governed by the MIT license, a copy of which can
// be found in the LICENSE file.

import { RouteComponentProps, withRouter } from 'react-router-dom';
import React from 'react';
import bind from 'bind-decorator';
import moment from 'moment';

import ApplicationProperties from '../app/ApplicationProperties';
import { UpdateTimeTracker } from '../components/UpdateTimeTracker';
import { determineUpdateMoment } from '../app/util/determineUpdateMoment';
import slug from '../app/util/Slug';

import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import BrightnessMediumIcon from '@material-ui/icons/BrightnessMedium';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Divider from '@material-ui/core/Divider';
import FaceIcon from '@material-ui/icons/Face';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import LiveTvIcon from '@material-ui/icons/LiveTv';
import PhoneIcon from '@material-ui/icons/Phone';
import SearchIcon from '@material-ui/icons/Search';
import { Theme } from '@material-ui/core/styles/createMuiTheme';
import TodayIcon from '@material-ui/icons/Today';
import Typography from '@material-ui/core/Typography';
import createStyles from '@material-ui/core/styles/createStyles';
import withStyles, { WithStyles } from '@material-ui/core/styles/withStyles';

const styles = (theme: Theme) =>
    createStyles({
        denseContent: { padding: `0 ${theme.spacing(1)}px !important` },
        denseList: { padding: `0 ${theme.spacing(2)}px` },

        card: { ...theme.fullWidthCardMixin },

        introContent: {
            paddingBottom: `${theme.spacing(2)}px !important`,
        },

        unavailableCard: { ...theme.pastSessionStyle },
        activeSessionCard: { ...theme.activeSessionStyle },

        inlineIcon: {
            fontSize: 'inherit',
            marginRight: theme.spacing(.5),
            position: 'relative',
            top: 2,
        },

        subtitle: {
            fontSize: 14,
        },

        buttonIcon: { marginRight: theme.spacing(2) },
        button: {
            color: theme.palette.text.secondary,
            justifyContent: 'left',
            margin: `${theme.spacing(-.5)}px 0`,
            textTransform: 'none',
            fontWeight: 'normal',
        },

    });

/**
 * Common introduction message that will be displayed for all users.
 */
const kCommonIntro = `You can find the full festival program in this portal.`;

/**
 * Interface defining a tip that can be displayed on the overview page.
 */
interface Tip {
    title: string;
    description: string;
    icon: JSX.Element;
}

/**
 * List of tips that can be displayed on the overview page. A random tip will be chosen each time
 * the page renders. Try to minimize the number of different icons in this list.
 */
const kTips: Tip[] = [
    {
        title: 'Need a senior?',
        description: 'Did you know that you can quickly call a senior by clicking on the phone ' +
                     'icon on their schedule page?',
        icon: <PhoneIcon />
    },
    {
        title: 'Looking for something?',
        description: 'Did you know that you can quickly search for volunteers, locations and ' +
                     'events from the header bar?',
        icon: <SearchIcon />
    },
    {
        title: 'Overwhelmed by light?',
        description: 'Did you know that the portal supports a dark theme? Enable it on your ' +
                     'phone or through the top-right menu.',
        icon: <BrightnessMediumIcon />
    },
    {
        title: 'Not sure what to do?',
        description: 'Did you know that most shifts come with instructions? Check them out on ' +
                     'the event pages, or ask a senior.',
        icon: <FaceIcon />
    },
    {
        title: 'Not sure what\'s happening?',
        description: 'Did you know that events that are currently happening are highlighted, and ' +
                     'past events will be moved down?',
        icon: <LiveTvIcon />
    }
];

/**
 * Details about a shift as they have to be rendered on the overview page.
 */
interface ShiftDetails {
    /**
     * Name of the shift, that defines the task.
     */
    name: string;

    /**
     * Description of the shift and what the volunteer is meant to be doing.
     */
    description?: string;

    /**
     * Timestamp, relative to the current time, at which the shift will be taking place.
     */
    timestamp: string;

    /**
     * Location of the page where the user has to be send to after clicking on this.
     */
    to: string;
}

/**
 * State of the overview page, detailing the information that's currently being presented to the
 * user. The displayed tip is random, and not part of the page's state.
 */
interface State {
    /**
     * The introduction message that should be displayed in the very first card.
     */
    intro: string;

    /**
     * The shift that the volunteer is currently engaged in.
     */
    activeShift?: ShiftDetails;

    /**
     * The shift that the volunteer will engage in next.
     */
    upcomingShift?: ShiftDetails;

    /**
     * Time at which the volunteer becomes available again, if they've currently been marked as
     * unavailable. Will be displayed in a separate box.
     */
    unavailableUntil?: string;

    /**
     * Moment at which the next automated update of this page should occur.
     */
    nextUpdate?: moment.Moment;
}

type Properties = ApplicationProperties & RouteComponentProps & WithStyles<typeof styles>;

class OverviewPage extends React.Component<Properties, State> {
    updateTimer?: NodeJS.Timeout;
    state: State = {
        intro: '',
    };

    componentDidMount() { this.refreshUpdateTimer(); }
    componentDidUpdate() { this.refreshUpdateTimer(); }

    /**
     * Refreshes the |updateTimer| by clearing the current one and setting a new one.
     */
    private refreshUpdateTimer() {
        const { clock } = this.props;
        const { nextUpdate } = this.state;

        if (this.updateTimer)
            clearTimeout(this.updateTimer);

        // It's possible that there are no future updates, for example when the last shift for this
        // volunteer has been finished already.
        if (!nextUpdate)
            return;

        this.updateTimer = setTimeout(this.refreshState, nextUpdate.diff(clock.getMoment()));
    }

    /**
     * Called by the |updateTimer| as an event listed on the page has finished or is about to start.
     */
    @bind
    private refreshState() {
        this.setState(OverviewPage.getDerivedStateFromProps(this.props));
        this.refreshUpdateTimer();
    }

    componentWillUnmount() {
        if (this.updateTimer)
            clearTimeout(this.updateTimer);
    }

    /**
     * Called when the component mounts or updates, to compute the state. This will trigger React to
     * request a re-render of the element and the displayed information.
     */
    static getDerivedStateFromProps(props: Properties) {
        const currentTime = props.clock.getMoment();
        const volunteer = props.event.getCurrentVolunteer();

        let nextScheduleUpdate = currentTime.clone().add({ years: 1 });

        const { environment } = props;

        let initialState: State = {
            intro: '',
            activeShift: undefined,
            upcomingShift: undefined,
            unavailableUntil: undefined,
        };

        // Not everyone that's able to log in to the portal is a volunteer, and might thus not have
        // a schedule available to them.
        if (volunteer) {
            for (const shift of volunteer.shifts) {
                if (shift.endTime < currentTime)
                    continue;  // the shift has passed

                if (shift.isAvailable())
                    continue;  // they're just wandering about

                const isActive = shift.beginTime <= currentTime;

                // The volunteer might have been marked as explicitly being unavailable during this
                // time, which we can reflect on the overview page too. Otherwise we ignore this.
                if (shift.isUnavailable()) {
                    if (isActive) {
                        initialState.unavailableUntil = shift.endTime.format('HH:mm');
                        initialState.nextUpdate = moment.min(nextScheduleUpdate, shift.endTime);
                    }
                    continue;
                }

                const event = shift.event;
                const session = event.sessions[0];

                const details: ShiftDetails = {
                    name: session.name,
                    description: session.description || undefined,
                    to: '/schedule/events/' + event.id + '/' + slug(session.name),

                    // Format the timestamp depending on whether the session is currently active or
                    // not. If so, display when it ends, otherwise when it starts.
                    timestamp: isActive ? 'until ' + shift.endTime.format('HH:mm')
                                        : shift.beginTime.from(currentTime)
                };

                // Consider this |shift| for scheduling the next page update.
                nextScheduleUpdate = moment.min(nextScheduleUpdate, isActive ? shift.endTime :
                                                                               shift.beginTime);

                if (isActive) {
                    initialState.activeShift = details;
                    continue;
                }

                initialState.upcomingShift = details;
                break;
            }

            const shiftCount = volunteer.shifts.filter(shift => shift.isEvent()).length;

            // Compile the portal's introduction. This is different depending on whether the user
            // is a volunteer as well, as we'd be able to personalize the message.
            initialState.intro = `Welcome on the ${environment.portalTitle}, ${volunteer.name}! ` +
                                 `You've been scheduled for ${shiftCount} shifts this weekend. ` +
                                 kCommonIntro;
        } else {
            initialState.intro = `Welcome on the ${environment.portalTitle}! ` + kCommonIntro;
        }

        initialState.nextUpdate = determineUpdateMoment(currentTime, nextScheduleUpdate);
        return initialState;
    }

    /**
     * Navigates to the shift that the volunteer is currently serving on.
     */
    @bind
    navigateToActiveShift() {
        const { activeShift } = this.state;
        const { history } = this.props;

        if (activeShift)
            history.push(activeShift.to);
    }

    /**
     * Navigates to the shift that the volunteer will be working on next.
     */
    @bind
    navigateToUpcomingShift() {
        const { upcomingShift } = this.state;
        const { history } = this.props;

        if (upcomingShift)
            history.push(upcomingShift.to);
    }

    /**
     * Navigates to the full schedule of the current volunteer.
     */
    @bind
    navigateToSchedule() {
        const volunteer = this.props.event.getCurrentVolunteer();
        if (!volunteer)
            return;

        this.props.history.push('/volunteers/' + slug(volunteer.name));
    }

    render() {
        const { classes, environment } = this.props;
        const { activeShift, intro, unavailableUntil, upcomingShift, nextUpdate } = this.state;

        // Choose a random tip to display on the overview page.
        const tip = kTips[Math.floor(Math.random() * kTips.length)];

        return (
            <React.Fragment>
                <Card className={classes.card}>
                    <CardContent>
                        <Typography variant="h5" component="h2" noWrap>
                            {environment.eventName}
                        </Typography>
                        <Typography variant="body2" component="p">
                            {intro}
                        </Typography>
                    </CardContent>
                </Card>

                { unavailableUntil &&
                    <Card className={classes.card} classes={{ root: classes.unavailableCard }}>
                        <CardContent className={classes.introContent}>
                            <Typography variant="subtitle1">
                                You're on a scheduled break
                            </Typography>
                            <Typography variant="body2" color="textSecondary">
                                You're currently on scheduled time off, which means that the seniors
                                won't bother you until {unavailableUntil}. Enjoy!
                            </Typography>
                        </CardContent>
                    </Card> }

                { activeShift &&
                    <Card className={classes.card}
                          classes={{ root: classes.activeSessionCard }}
                          onClick={this.navigateToActiveShift}>
                        <CardActionArea>
                            <CardContent>
                                <Typography className={classes.subtitle}
                                            color="textSecondary" gutterBottom>
                                    <TodayIcon className={classes.inlineIcon} />
                                    Your current shift • {activeShift.timestamp}
                                </Typography>
                                <Typography variant="h5" component="h2" noWrap>
                                    {activeShift.name}
                                </Typography>
                                { activeShift.description &&
                                    <Typography variant="body2" component="p" noWrap>
                                        {activeShift.description}
                                    </Typography> }
                            </CardContent>
                        </CardActionArea>
                    </Card> }

                { upcomingShift &&
                    <Card className={classes.card}>
                        <CardActionArea onClick={this.navigateToUpcomingShift}>
                            <CardContent>
                                <Typography className={classes.subtitle}
                                            color="textSecondary" gutterBottom>
                                    <TodayIcon className={classes.inlineIcon} />
                                    Your next shift • {upcomingShift.timestamp}
                                </Typography>
                                <Typography variant="h5" component="h2" noWrap>
                                    {upcomingShift.name}
                                </Typography>
                                { upcomingShift.description &&
                                    <Typography variant="body2" component="p" noWrap>
                                        {upcomingShift.description}
                                    </Typography> }
                            </CardContent>
                            <Divider />
                        </CardActionArea>
                        <CardActions>
                            <Button className={classes.button}
                                    onClick={this.navigateToSchedule}
                                    fullWidth>
                                <ArrowForwardIcon className={classes.buttonIcon} /> Show full schedule
                            </Button>
                        </CardActions>
                    </Card> }

                <Card className={classes.card}>
                    <CardContent className={classes.denseContent}>
                        <List className={classes.denseList}>
                            <ListItem>
                                <ListItemIcon>
                                    {tip.icon}
                                </ListItemIcon>
                                <ListItemText primary={tip.title}
                                              secondary={tip.description} />
                            </ListItem>
                        </List>
                    </CardContent>
                </Card>

                <UpdateTimeTracker label="Overview" moment={nextUpdate} />
            </React.Fragment>
        );
    }
}

export default withRouter(withStyles(styles)(OverviewPage));
