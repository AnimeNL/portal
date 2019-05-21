// Copyright 2019 Peter Beverloo. All rights reserved.
// Use of this source code is governed by the MIT license, a copy of which can
// be found in the LICENSE file.

import Clock from './Clock';
import Environment from './Environment';
import Event from './Event';
import User from './User';
import { ServiceWorkerManager } from './ServiceWorkerManager';

/**
 * The ApplicationProperties are made available to each controller that's part of the portal for
 * authenticated users. PortalController.render() contains a utility function for forwarding them.
 */
export default interface ApplicationProperties {
    clock: Clock;
    environment: Environment;
    event: Event;
    user: User;
    serviceWorker: ServiceWorkerManager;
}
