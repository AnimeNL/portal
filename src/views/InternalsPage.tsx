// Copyright 2019 Peter Beverloo. All rights reserved.
// Use of this source code is governed by the MIT license, a copy of which can
// be found in the LICENSE file.

import React from 'react';
import bind from 'bind-decorator';
import moment from 'moment';

import AccessTimeIcon from '@material-ui/icons/AccessTimeOutlined';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';
import Paper from '@material-ui/core/Paper';
import RestoreIcon from '@material-ui/icons/Restore';
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
}

class InternalsPage extends React.Component<Properties & WithStyles<typeof styles>, State> {
    state: State;

    // References to the date- and time pickers to be able to open them programmatically. Ideally
    // these would be typed as React.RefObject<>, but the compiler isn't able to find open().
    private datePickerRef: any;
    private timePickerRef: any;

    // Store timeout so we can remove it when we switch to a different page or alter the date/time.
    private timeChangeTimeout?: NodeJS.Timeout;

    constructor(props: any) {
        super(props);

        this.datePickerRef = React.createRef();
        this.timePickerRef = React.createRef();

        this.state = {
            currentTime: props.initialTime
        };

        this.startAsyncTimeChange(props.initialTime);
    }

    /**
     * Set timeout to start minute update at correct offset from given moment
     */
    @bind
    startAsyncTimeChange(date: moment.Moment): void {
        if (this.timeChangeTimeout)
            clearTimeout(this.timeChangeTimeout);

        let offset = (60 - parseInt(date.format('s'))) * 1000;
        this.timeChangeTimeout = setTimeout(this.asyncTimeChange, offset);
    }

    /**
     * Update time shown at Date/Time pickers
     */
    @bind
    asyncTimeChange(): void {
        this.setState({
            currentTime: this.state.currentTime.add(1, 'minute'),
        });

        this.timeChangeTimeout = setTimeout(this.asyncTimeChange, 60000);
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
     * Called when the date has been changed. A time update will be propagated to the controller
     * based on the diff with the input time.
     */
    @bind
    onTimeChanged(date: moment.Moment): void {
        this.props.onTimeChanged(date);
        this.setState({
            currentTime: date
        });
        this.startAsyncTimeChange(date);
    }

    render() {
        const { classes } = this.props;
        const { currentTime } = this.state;

        return (
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
        );
    }
}

export default withStyles(styles)(InternalsPage);
