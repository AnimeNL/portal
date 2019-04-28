// Copyright 2019 Peter Beverloo. All rights reserved.
// Use of this source code is governed by the MIT license, a copy of which can
// be found in the LICENSE file.

import EventLoader from './EventLoader';
import { IEvent } from './api/IEvent';
import User from './User';

/**
 * Represents the event this volunteer portal exists for, including data on all the volunteers,
 * events and sessions. Provides a number of utility functions for selecting data.
 */
class Event {
    // TODO: Individual properties w/ data.

    /**
     * Asynchronously loads the event using the EventLoader. The |user| instance will be used to
     * obtain their authentication token, and to sign them out in case their data expired.
     */
    async load(user: User): Promise<void> {
        const eventLoader = new EventLoader();

        // Wait until loading has been completed. If loading failed due to a user error, sign them
        // out of their account forcing them back to the login screen.
        if (!await eventLoader.load(user.authToken)) {
            if (eventLoader.isUserError())
                user.logout();

            return;
        }

        const eventData = eventLoader.eventData;
        // ...
    }

    /**
     * Returns whether all event information is fully available.
     */
    isAvailable(): boolean {
        return true;
    }
}

export default Event;
