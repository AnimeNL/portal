// Copyright 2019 Peter Beverloo. All rights reserved.
// Use of this source code is governed by the MIT license, a copy of which can
// be found in the LICENSE file.

import { Observable, Observer } from '../app/util/Observable';

/**
 * The TitleManager is responsible for propagating title changes throughout the application. It
 * can be observed for title updates, and notify observers when an update has to happen.
 */
export const TitleManager = new Observable<[string | null]>();
export type TitleObserver = Observer<[string | null]>;
