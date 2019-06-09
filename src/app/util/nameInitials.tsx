// Copyright 2019 Peter Beverloo. All rights reserved.
// Use of this source code is governed by the MIT license, a copy of which can
// be found in the LICENSE file.

/**
 * Naive algorithm for getting the initials for a particular name: selecting the first and the last
 * capital available in the name.
 */
export const nameInitials = (name: string) =>
    name.replace(/[^A-Z]/g, '').replace(/^(.).*(.)/g, '$1$2');
