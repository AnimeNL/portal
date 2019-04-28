// Copyright 2019 Peter Beverloo. All rights reserved.
// Use of this source code is governed by the MIT license, a copy of which can
// be found in the LICENSE file.

import EventLoader from './EventLoader';
import User from './User';

/**
 * Represents the event this volunteer portal exists for, including data on all the volunteers,
 * events and sessions. Provides a number of utility functions for selecting data.
 */
class Event {
    loader: EventLoader;

    constructor() {
        this.loader = new EventLoader();
    }

    /**
     * Asynchronously loads the event using the EventLoader. The |user| instance will be used to
     * obtain their authentication token, and to sign them out in case their data expired.
     */
    async load(user: User): Promise<void> {
        // TODO: Load the event data.
    }

    /**
     * Returns whether all event information is fully available.
     */
    isAvailable(): boolean {
        return true;
    }
}

export default Event;
