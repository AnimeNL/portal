// Copyright 2019 Peter Beverloo. All rights reserved.
// Use of this source code is governed by the MIT license, a copy of which can
// be found in the LICENSE file.

import React from 'react';
import bind from 'bind-decorator';
import moment from 'moment';

import Event from '../app/Event';
import { ThemeProvider } from '../theme';

import AccessTimeIcon from '@material-ui/icons/AccessTimeOutlined';
import Checkbox from '@material-ui/core/Checkbox';
import InvertColorsIcon from '@material-ui/icons/InvertColors';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListSubheader from '@material-ui/core/ListSubheader';
import Paper from '@material-ui/core/Paper';
import RestoreIcon from '@material-ui/icons/Restore';
import Snackbar from '@material-ui/core/Snackbar';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import { Theme } from '@material-ui/core/styles/createMuiTheme';
import TodayIcon from '@material-ui/icons/TodayOutlined';
import createStyles from '@material-ui/core/styles/createStyles';
import withStyles, { WithStyles } from '@material-ui/core/styles/withStyles';

import { DatePicker, TimePicker } from 'material-ui-pickers';

const styles = (theme: Theme) =>
    createStyles({
        hidden: { display: 'none' }
    });

/**
 * Properties accepted by the <InternalsPage> element.
 */
interface Properties {
    /**
     * Event to be called when the time or date has been changed per the override settings. The
     * change should be applied immediately to the entire application.
     */
    onTimeChanged: (time: moment.Moment) => void;

    /**
     * The event for which this portal is being rendered.
     */
    event: Event;

    /**
     * The time and date actual at the moment this page got mounted. We won't live-update the page
     * as time changes, to avoid interrupting the user in making changes.
     */
    initialTime: moment.Moment;
}

/**
 * State of the <InternalsPage> element.
 */
interface State {
    /**
     * Current time. Initialized to the |initialTime| property.
     */
    currentTime: moment.Moment;

    /**
     * Whether dark theme is enabled for the application.
     */
    darkThemeEnabled: boolean;

    /**
     * Whether the dark theme change feedback is currently visible.
     */
    darkThemeFeedbackVisible: boolean;
}

class InternalsPage extends React.Component<Properties & WithStyles<typeof styles>, State> {
    state: State;

    // References to the date- and time pickers to be able to open them programmatically. Ideally
    // these would be typed as React.RefObject<>, but the compiler isn't able to find open().
    private datePickerRef: any;
    private timePickerRef: any;

    // Store timeout so we can remove it when we switch to a different page or alter the date/time.
    private updateTimerTimeout?: NodeJS.Timeout;

    constructor(props: any) {
        super(props);

        this.datePickerRef = React.createRef();
        this.timePickerRef = React.createRef();

        this.state = {
            currentTime: props.initialTime,
            darkThemeEnabled: ThemeProvider.isDarkThemeEnabled(),
            darkThemeFeedbackVisible: false,
        };
    }


    /**
     * Called just before the <InternalsPage> is mount.
     * This starts the timer to update the Date/Time pickers.
     */
    componentWillMount() {
        this.startUpdateTimer(this.state.currentTime);
    }

    /**
     * Called just before the <PortalView> is unmount.
     * This stops the time that updates the Date/Time pickers.
     */
    componentWillUnmount() {
        if (this.updateTimerTimeout)
            clearTimeout(this.updateTimerTimeout);
    }
    /**
     * Set timeout to start minute update at correct offset from given moment
     */
    @bind
    startUpdateTimer(date: moment.Moment): void {
        if (this.updateTimerTimeout)
            clearTimeout(this.updateTimerTimeout);

        const offset = (60 - date.second()) * 1000;
        this.updateTimerTimeout = setTimeout(this.updateTime, offset);
    }

    /**
     * Update time shown at Date/Time pickers
     */
    @bind
    updateTime(): void {
        this.setState({
            currentTime: this.state.currentTime.add(1, 'minute'),
        });

        this.updateTimerTimeout = setTimeout(this.updateTime, 60000);
    }

    @bind
    openDatePicker(): void {
        if (this.datePickerRef.current)
            this.datePickerRef.current.open();
    }

    @bind
    openTimePicker(): void {
        if (this.timePickerRef.current)
            this.timePickerRef.current.open();
    }

    /**
     * Resets any active time overrides back to the default device time.
     */
    @bind
    resetTime(): void {
        this.onTimeChanged(moment());
    }

    /**
     * Toggles whether dark theme should be enabled for the application. The page must be refreshed
     * for the change to take effect, so a snackbar will be shown to that effect.
     */
    @bind
    toggleDarkTheme(): void {
        const enabled: boolean = !this.state.darkThemeEnabled;

        ThemeProvider.setDarkThemeEnabled(enabled);

        this.setState({
            darkThemeEnabled: enabled,
            darkThemeFeedbackVisible: true
        })
    }

    /**
     * Called when the dark theme feedback snackbar should be closed.
     */
    @bind
    onDarkThemeFeedbackComplete(): void {
        this.setState({
            darkThemeFeedbackVisible: false,
        })
    }

    /**
     * Called when the date has been changed. A time update will be propagated to the controller
     * based on the diff with the input time.
     */
    @bind
    onTimeChanged(date: moment.Moment): void {
        this.props.onTimeChanged(date);
        this.setState({
            currentTime: date
        });
        this.startUpdateTimer(date);
    }

    render() {
        const { classes, event } = this.props;
        const { currentTime, darkThemeEnabled, darkThemeFeedbackVisible } = this.state;

        return (
            <>
                <Paper square elevation={1}>
                    <List subheader={<ListSubheader>Date and time configuration</ListSubheader>}>
                        <ListItem button divider onClick={this.openDatePicker}>
                            <ListItemIcon>
                                <TodayIcon />
                            </ListItemIcon>
                            <ListItemText primary="Change the date" secondary={currentTime.format('dddd, MMMM D')} />
                        </ListItem>

                        <ListItem button divider onClick={this.openTimePicker}>
                            <ListItemIcon>
                                <AccessTimeIcon />
                            </ListItemIcon>
                            <ListItemText primary="Change the time" secondary={currentTime.format('H:mm')} />
                        </ListItem>

                        <ListItem button onClick={this.resetTime}>
                            <ListItemIcon>
                                <RestoreIcon />
                            </ListItemIcon>
                            <ListItemText primary="Reset time time" />
                        </ListItem>
                    </List>

                    <List subheader={<ListSubheader>Theme configuration</ListSubheader>}>
                        <ListItem button onClick={this.toggleDarkTheme}>
                            <ListItemIcon>
                                <InvertColorsIcon />
                            </ListItemIcon>
                            <ListItemText primary="Enable dark theme" />
                            <ListItemSecondaryAction>
                                <Checkbox edge="end"
                                          onChange={this.toggleDarkTheme}
                                          checked={darkThemeEnabled} />
                            </ListItemSecondaryAction>
                        </ListItem>
                    </List>

                </Paper>

                <Paper style={{ marginTop: '20px' }} square elevation={1}>
                    <Table padding="default">
                        <TableHead>
                            <TableRow>
                                <TableCell>Internal note</TableCell>
                                <TableCell>Value</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>

                            { Object.entries(event.getInternalNotes()).map((entry, index) => {
                                return (
                                    <TableRow hover key={index}>
                                        <TableCell style={{ fontWeight: 500 }}>
                                            {entry[0]}
                                        </TableCell>
                                        <TableCell>
                                            {entry[1]}
                                        </TableCell>
                                    </TableRow>
                                );
                            }) }

                        </TableBody>
                    </Table>

                    <div className={classes.hidden}>
                        <DatePicker
                            ref={this.datePickerRef}
                            onChange={this.onTimeChanged}
                            value={currentTime} />
                        <TimePicker
                            ref={this.timePickerRef}
                            onChange={this.onTimeChanged}
                            value={currentTime}
                            ampm={false} />
                    </div>
                </Paper>

                <Snackbar anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                          open={darkThemeFeedbackVisible}
                          message="Refresh for the change to take effect"
                          autoHideDuration={3000}
                          onClose={this.onDarkThemeFeedbackComplete} />

            </>
        );
    }
}

export default withStyles(styles)(InternalsPage);
