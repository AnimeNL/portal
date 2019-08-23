// Copyright 2019 Peter Beverloo. All rights reserved.
// Use of this source code is governed by the MIT license, a copy of which can
// be found in the LICENSE file.

import { Application } from '../base/Application';
import { Configuration } from '../base/Configuration';
import { Environment } from '../base/Environment';

/**
 * The registration application represents the runtime used for the public registration portal,
 * where visitors can register their interest in joining the volunteering team.
 */
export class RegistrationApplication implements Application {
    async initialize(configuration: Configuration, environment: Environment): Promise<void> {
    }
}
