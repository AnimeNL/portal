// Copyright 2019 Peter Beverloo. All rights reserved.
// Use of this source code is governed by the MIT license, a copy of which can
// be found in the LICENSE file.

/**
 * Validates that the given |input| is a boolean.
 *
 * @param input The input variable, of any type.
 * @return Whether the |input| is a boolean.
 */
export function isBoolean(input: any): input is boolean {
    return typeof input === 'boolean';
}

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
 * Validates that the given |input| is either a number or null.
 *
 * @param input The input variable, of any type.
 * @return Whether the |input| is a number or null.
 */
export function isNumberOrNull(input: any): input is number | null {
    return input === null || typeof input === 'number';
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

/**
 * Validates that the given |input| is either a string or null.
 *
 * @param input The input variable, of any type.
 * @return Whether the |input| is a string or null.
 */
export function isStringOrNull(input: any): input is string | null {
    return input === null || typeof input === 'string';
}

/**
 * Logs a validation error for the given |interfaceName| and |property| to the console.
 */
export function validationError(interfaceName: string, property: string): void {
    console.error(`Unable to validate ${interfaceName}.${property}.`);
}
