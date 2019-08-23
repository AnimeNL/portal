// Copyright 2019 Peter Beverloo. All rights reserved.
// Use of this source code is governed by the MIT license, a copy of which can
// be found in the LICENSE file.

import { Configuration } from './Configuration';
import { Environment } from './Environment';

/**
 * Interface definition for each sub-application part of the Volunteer Portal. These will be
 * created and initialised by the [[ApplicationLoader]].
 */
export interface Application {
    initialize(configuration: Configuration, environment: Environment): Promise<void>;
}
