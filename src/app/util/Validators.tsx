// Copyright 2019 Peter Beverloo. All rights reserved.
// Use of this source code is governed by the MIT license, a copy of which can
// be found in the LICENSE file.

/**
 * Validates that the given |input| is a number.
 *
 * @param input The input variable, of any type.
 * @return Whether the |input| is a number.
 */
export function isNumber(input: any): input is number {
    return typeof input === 'number';
}

/**
 * Validates that the given |input| is a string.
 *
 * @param input The input variable, of any type.
 * @return Whether the |input| is a string.
 */
export function isString(input: any): input is string {
    return typeof input === 'string';
}
