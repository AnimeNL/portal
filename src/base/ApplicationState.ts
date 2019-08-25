// Copyright 2019 Peter Beverloo. All rights reserved.
// Use of this source code is governed by the MIT license, a copy of which can
// be found in the LICENSE file.

import { Configuration } from './Configuration';
import { Environment } from './Environment';
import { User } from './User';

/**
 * Interface that defines the properties that will be shared to applications by the loader.
 */
export interface ApplicationState {
    configuration: Configuration;
    // TODO: Add the |container|.
    environment: Environment;
    user: User;
}
