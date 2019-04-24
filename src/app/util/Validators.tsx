// Copyright 2019 Peter Beverloo. All rights reserved.
// Use of this source code is governed by the MIT license, a copy of which can
// be found in the LICENSE file.

export function isNumber(input: any): input is number {
    return typeof input === 'number';
}

export function isString(input: any): input is string {
    return typeof input === 'string';
}
