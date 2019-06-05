// Copyright 2019 Peter Beverloo. All rights reserved.
// Use of this source code is governed by the MIT license, a copy of which can
// be found in the LICENSE file.

import bind from 'bind-decorator';
import moment from 'moment';

import EventLoader from './EventLoader';
import { ScheduleNotifier } from '../state/ScheduleNotifier';

/**
 * Interval, in minutes, at which we should check for event updates.
 */
const kUpdateIntervalMinutes = 10;

/**
 * Automatically re-loads the event at a configured interval to check whether updates are available.
 * If updates are found, a banner will be displayed to the volunteer.
 */
export class EventUpdateChecker {
    /**
     * The authentication token for which updates should be processed.
     */
    private authToken: string;

    /**
     * Moment at which the last update check has been done.
     */
    private lastUpdateCheck: moment.Moment;

    /**
     * Version of the event that has been loaded into the portal.
     */
    private version: string;

    /**
     * Timer that's handling the updates. Will be cancelled 
     */
    private updateTimer: NodeJS.Timer;

    constructor(authToken: string, version: string) {
        this.authToken = authToken;
        this.version = version;

        this.lastUpdateCheck = moment();
        this.updateTimer = setInterval(this.update, kUpdateIntervalMinutes * 60 * 1000);

        document.addEventListener('visibilitychange', this.visibilityChange);
    }

    /**
     * Called when the window's visibility status changes. To deal with timer suspension in modern
     * browsers, we might have to re-set the |updateTimer|.
     */
    @bind
    visibilityChange(): void {
        if (document.visibilityState !== 'visible')
            return;
        
        if (moment().diff(this.lastUpdateCheck, 'minutes') >= kUpdateIntervalMinutes)
            this.update();
    }

    /**
     * Attempts to load the event data and compares the version with |this.version| if successful.
     * If a new version is available, a snackbar will be displayed to the user.
     */
    @bind
    async update(): Promise<void> {
        const eventLoader = new EventLoader();

        // Update the last update time to be *now*.
        this.lastUpdateCheck = moment();

        // If the event data could not be loaded, bail out. If it couldn't be loaded due to user
        // error, for example because their credentials expired, reload the page.
        if (!await eventLoader.load(this.authToken)) {
            if (eventLoader.isUserError())
                document.location.reload();

            return;
        }

        const eventData = eventLoader.eventData;

        // If no version information is available, bail out.
        if (!eventData.version)
            return;

        // If the loaded event version is different from the available version, force-show the
        // snackbar to indicate that an update is available.
        if (eventData.version === this.version)
            return;

        clearInterval(this.updateTimer);
        ScheduleNotifier.notify();
    }
}
