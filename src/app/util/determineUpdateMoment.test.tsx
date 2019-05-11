// Copyright 2019 Peter Beverloo. All rights reserved.
// Use of this source code is governed by the MIT license, a copy of which can
// be found in the LICENSE file.

import { assert } from 'chai';
import moment from 'moment';

import '../../config';  // make sure the moment locale update happens
import { determineUpdateMoment } from './determineUpdateMoment';

describe('determineUpdateMoment', () => {
    function display(duration: moment.DurationInputObject): string {
        const currentTime = moment();
        return moment(moment(currentTime).add(duration)).fromNow(true);
    }

    function update(duration: moment.DurationInputObject): number {
        const currentTime = moment();
        const scheduleUpdate = moment().add(duration);

        // Substract a second for the leeway allowed for visible updates to propagate.
        return determineUpdateMoment(currentTime, scheduleUpdate).diff(currentTime, 'seconds') - 1;
    }

    it('should match the assumptions we make about momentJS', () => {
        assert.strictEqual(display({ seconds: 1 }), '1m');
        assert.strictEqual(display({ seconds: 30 }), '1m');
        assert.strictEqual(display({ seconds: 60 }), '1m');
        assert.strictEqual(display({ seconds: 89 }), '1m');
        assert.strictEqual(display({ seconds: 90 }), '2m');

        assert.strictEqual(display({ minutes: 20, seconds: 29 }), '20m');
        assert.strictEqual(display({ minutes: 20, seconds: 30 }), '21m');
        assert.strictEqual(display({ minutes: 44 }), '44m');
        assert.strictEqual(display({ minutes: 45 }), '1h');

        assert.strictEqual(display({ hours: 10, minutes: 29 }), '10h');
        assert.strictEqual(display({ hours: 10, minutes: 30 }), '11h');
        assert.strictEqual(display({ hours: 21 }), '21h');
        assert.strictEqual(display({ hours: 22 }), '1d');

        assert.strictEqual(display({ days: 15, hours: 11 }), '15d');
        assert.strictEqual(display({ days: 15, hours: 12 }), '16d');
        assert.strictEqual(display({ days: 25 }), '25d');
        assert.strictEqual(display({ days: 26 }), '1M');
    });

    it('should update every minute for schedule updates <= 44 minutes', () => {
        assert.strictEqual(update({ seconds: 22 }), 22);
        assert.strictEqual(update({ seconds: 60 }), 30);
        assert.strictEqual(update({ seconds: 61 }), 31);
        assert.strictEqual(update({ seconds: 300 }), 30);

        assert.strictEqual(update({ minutes: 1 }), 30);
        assert.strictEqual(update({ minutes: 25 }), 30);
        assert.strictEqual(update({ minutes: 30, seconds: 30 }), 60);
        assert.strictEqual(update({ minutes: 44 }), 30);
    });

    it('should update every hour for schedule updates <= 21 hours', () => {
        assert.strictEqual(update({ minutes: 45 }), 60);
        assert.strictEqual(update({ minutes: 50 }), 6 * 60);
        assert.strictEqual(update({ hours: 1 }), 16 * 60);

        assert.strictEqual(update({ hours: 2 }), 30 * 60);
        assert.strictEqual(update({ hours: 2, minutes: 30 }), 60 * 60);
        assert.strictEqual(update({ hours: 20, minutes: 15 }), 45 * 60);
    });

    it('should update every day for schedule updates <= 25 days', () => {
        assert.strictEqual(update({ days: 1 }), 3 * 60 * 60);
        assert.strictEqual(update({ days: 10 }), 12 * 60 * 60);

        assert.strictEqual(update({ days: 20, hours: 12 }), 24 * 60 * 60);
        assert.strictEqual(update({ days: 20, hours: 18 }), 6 * 60 * 60);
    });

    it('should update every day for schedule updates > 25 days', () => {
        assert.strictEqual(update({ days: 26 }), 24 * 60 * 60);
        assert.strictEqual(update({ months: 6 }), 24 * 60 * 60);
        assert.strictEqual(update({ years: 30 }), 24 * 60 * 60);
    });
});
