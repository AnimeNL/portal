// Copyright 2019 Peter Beverloo. All rights reserved.
// Use of this source code is governed by the MIT license, a copy of which can
// be found in the LICENSE file.

import { Observable, Observer } from '../app/util/Observable';

/**
 * The ScheduleNotifier is responsible for propagating schedule updates throughout the application.
 * A snackbar should be shown when an update is known to be available.
 */
export const ScheduleNotifier = new Observable();
export type ScheduleObserver = Observer<[]>;
