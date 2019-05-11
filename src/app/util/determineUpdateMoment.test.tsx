// Copyright 2019 Peter Beverloo. All rights reserved.
// Use of this source code is governed by the MIT license, a copy of which can
// be found in the LICENSE file.

import { assert } from 'chai';

import { determineUpdateMoment } from './determineUpdateMoment';

describe('determineUpdateMoment', () => {

    it('should return true', () => {
        assert.strictEqual(determineUpdateMoment(), true);
    })

});
