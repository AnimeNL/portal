// Copyright 2019 Peter Beverloo. All rights reserved.
// Use of this source code is governed by the MIT license, a copy of which can
// be found in the LICENSE file.

import React from 'react';
import bind from 'bind-decorator';
import moment from 'moment';

import Clock from '../app/Clock';

import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';

interface Properties {
    /**
     * Clock to determine the offset. Only relevant when |output| is set.
     */
    clock?: Clock;

    /**
     * Label that identifies the registered update timer.
     */
    label?: string;

    /**
     * Moment at which the update timer is due to update.
     */
    moment?: moment.Moment;

    /**
     * When set, the component will display a list of the active update timers.
     */
    output?: boolean;
}

interface State {
    /**
     * Map of label to #seconds remaining for the live update timers.
     */
    timers: Map<string, number>;
}

/**
 * The <UpdateTimeTracker> component serves two purposes: keeping track of the dynamic update timers
 * throughout the application, and rendering them in a list for debugging purposes. They can be used
 * as follows:
 *
 *     <UpdateTimeTracker label="Menu" moment={moment} />
 *     <UpdateTimeTracker output clock={clock} />
 *
 * <UpdateTimeTracker> components may not share labels.
 */
export class UpdateTimeTracker extends React.Component<Properties> {
    /**
     * The global update timer map that keeps track of everything.
     */
    private static updateTimerMap: Map<string, moment.Moment> = new Map();

    updateTimer?: NodeJS.Timeout;
    state: State = {
        timers: new Map(),
    };

    componentWillMount() {
        if (!this.props.output)
            return;

        this.updateTimer = setInterval(this.update, 1000);
    }

    componentWillUnmount() {
        if (this.updateTimer)
            clearInterval(this.updateTimer);

        if (this.props.label)
            UpdateTimeTracker.updateTimerMap.delete(this.props.label);
    }

    /**
     * Will run every second for output-targetted <UpdateTimeTracker>s. Updates the internal state
     * to match the timer map.
     */
    @bind
    update() {
        const { clock } = this.props;

        const currentTime = clock!.getMoment();
        const timers = new Map<string, number>();

        UpdateTimeTracker.updateTimerMap.forEach((updateTime, label) => {
            timers.set(label, Math.round(updateTime.diff(currentTime) / 1000));
        });

        this.setState({ timers });
    }

    render() {
        const { label, moment, output } = this.props;

        // If this component isn't meant for prodiving output, simply update the |moment| in the
        // `updateTimerMap` and return an empty fragment.
        if (!output) {
            if (label && moment)
                UpdateTimeTracker.updateTimerMap.set(label, moment);

            return <></>;
        }

        const { timers } = this.state;

        // Bail out when there are no timers to display.
        if (!timers.size)
            return <></>;

        return (
            <React.Fragment>
                <Divider />
                <Typography component="p" variant="caption" style={{ margin: '16px 0 0 16px' }}>
                    { Array.from(timers).map(([ label, seconds ]) =>
                        <React.Fragment>
                            <strong>{label}</strong>: {seconds}s<br />
                        </React.Fragment>) }
                </Typography>
            </React.Fragment>
        );
    }
}
