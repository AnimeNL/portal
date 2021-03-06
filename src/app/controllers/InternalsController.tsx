// Copyright 2019 Peter Beverloo. All rights reserved.
// Use of this source code is governed by the MIT license, a copy of which can
// be found in the LICENSE file.

import React from 'react';
import bind from 'bind-decorator';
import moment from 'moment';

import ApplicationProperties from '../ApplicationProperties';
import InternalsPage from '../../views/InternalsPage';
import { TitleManager } from '../../state/TitleManager';

/**
 * The InternalsController is responsible for enabling users with debugging capabilities to change
 * internal state of the application. An example of this is the current time, which makes it
 * possible to observe the state of the application at any given point in the future.
 */
class InternalsController extends React.Component<ApplicationProperties> {
    componentWillMount() {
        TitleManager.notify('Internals');
    }

    /**
     * Called when the date or time has been changed on the internals page. The new |time| should
     * take effect throughout the application.
     */
    @bind
    onTimeChanged(time: moment.Moment): void {
        this.props.clock.setMomentFromInternals(time);
    }

    render() {
        const { clock, event } = this.props;

        return <InternalsPage event={event}
                              initialTime={clock.getMoment()}
                              onTimeChanged={this.onTimeChanged} />;
    }
}

export default InternalsController;
