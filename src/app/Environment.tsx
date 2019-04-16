// Copyright 2019 Peter Beverloo. All rights reserved.
// Use of this source code is governed by the MIT license, a copy of which can
// be found in the LICENSE file.

import { EnvironmentConfigPath } from '../config';

// Represents the environment under which the volunteer portal is operating. Exposes various
// configuration options unique to groups of volunteers.
class Environment {
    available : boolean = false;

    // Initialization. Will fetch the environment configuration file from the server on pageload.
    // Expensive, but critical to the portal's behaviour.
    async initialize() {
        // TODO: Load and parse the |EnvironmentConfigPath|.
    }

    // Returns whether the environment is readily available, meaning that it was successfully
    // loaded, parsed and verified.
    isAvailable() : boolean {
        return this.available;
    }

}

export default Environment;
