// Copyright 2019 Peter Beverloo. All rights reserved.
// Use of this source code is governed by the MIT license, a copy of which can
// be found in the LICENSE file.

import { ConfigurationImpl } from './ConfigurationImpl';
import { UserImpl, kDefaultAbilities } from './UserImpl';

describe('UserImpl', () => {
    it('can assign certain abilities by default', () => {
        const configuration = new ConfigurationImpl();
        const user = new UserImpl(configuration);

        // While it is valid for there to be no default abilities, for the sake of verifying that
        // this test does something useful we'll assume there to be at least one.
        expect(kDefaultAbilities.length).toBeGreaterThan(0);

        kDefaultAbilities.forEach(ability =>
            expect(user.hasAbility(ability)).toBeTruthy());
    });
});
