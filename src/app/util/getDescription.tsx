// Copyright 2019 Peter Beverloo. All rights reserved.
// Use of this source code is governed by the MIT license, a copy of which can
// be found in the LICENSE file.

import { Floor } from '../Floor';
import { Location } from '../Location';

/**
 * Returns a textual description of the given |floor|.
 */
export function getFloorDescription(floor: Floor): string {
    return floor.label + ' (' + getFloorOrdinal(floor.id) + ')';
}

/**
 * Returns a textual description of the given |location|.
 */
export function getLocationDescription(location: Location): string {
    // TODO: Technically this split is only necessary for Anime, and not very future proof either,
    // but introducing an entirely new API for this seems overkill.
    const label = location.label.replace(/\s[-/].*/, '');

    return label + ' (' + getFloorOrdinal(location.floor.id) + ')';
}

/**
 * Gets the ordinal describing the floor identified by |number|.
 *
 * @see https://community.shopify.com/c/Shopify-Design/Ordinal-Number-in-javascript-1st-2nd-3rd-4th/m-p/72156
 */
function getFloorOrdinal(id: number): string {
    const ordinalIndicators = ['st', 'nd', 'rd'];
    const ordinal = id !== 0 ? id + ordinalIndicators[((id + 90) % 100 - 10) % 10 - 1] || 'th'
                             : 'ground';


    return `${ordinal} floor`;
}
