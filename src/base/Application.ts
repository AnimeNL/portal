// Copyright 2019 Peter Beverloo. All rights reserved.
// Use of this source code is governed by the MIT license, a copy of which can
// be found in the LICENSE file.

/**
 * Interface definition for each sub-application part of the Volunteer Portal. These will be
 * created and initialised by the [[ApplicationLoader]].
 */
export interface Application {
    /**
     * Asynchronously initialize the application and render the necessary contents.
     */
    initialize(): Promise<void>;
}
