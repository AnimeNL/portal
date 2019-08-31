// Copyright 2019 Peter Beverloo. All rights reserved.
// Use of this source code is governed by the MIT license, a copy of which can
// be found in the LICENSE file.

import { ContentProvider } from './ContentProvider';

/**
 * Properties made available to each top-level view of the Registration application.
 */
export interface RegistrationProperties {
    /**
     * The content provider that will source content to be displayed by this component.
     */
    contentProvider: ContentProvider;
}
