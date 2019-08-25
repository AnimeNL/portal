// Copyright 2019 Peter Beverloo. All rights reserved.
// Use of this source code is governed by the MIT license, a copy of which can
// be found in the LICENSE file.

import { Configuration } from './Configuration';
import { User } from './User';
import { UserAbility } from './UserAbility';

/**
 * List of abilities that will be granted to each visitor.
 */
export const kDefaultAbilities: UserAbility[] = [
    UserAbility.RegistrationApplication,
];

/**
 * Implementation of the User class, shared among all parts of the portal.
 */
export class UserImpl implements User {
    private abilities: Set<UserAbility>;
    private configuration: Configuration;

    constructor(configuration: Configuration) {
        this.abilities = new Set(kDefaultAbilities);
        this.configuration = configuration;
    }

    /**
     * Initializes the User class with all associated state.
     */
    async initialize(): Promise<void> {}

    hasAbility(ability: UserAbility): boolean {
        return this.abilities.has(ability);
    }

    hasAccount(): boolean {
        return false;
    }
}
