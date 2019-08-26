// Copyright 2019 Peter Beverloo. All rights reserved.
// Use of this source code is governed by the MIT license, a copy of which can
// be found in the LICENSE file.

import { ApplicationState } from '../base/ApplicationState';
import { ContentProvider } from './ContentProvider';

/**
 * Interface that defines the properties that will be shared to the registration application.
 */
export interface RegistrationApplicationState extends ApplicationState {
    contentProvider: ContentProvider;
}
