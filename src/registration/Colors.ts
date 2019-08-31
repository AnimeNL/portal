// Copyright 2019 Peter Beverloo. All rights reserved.
// Use of this source code is governed by the MIT license, a copy of which can
// be found in the LICENSE file.

import brown from '@material-ui/core/colors/brown';
import common from '@material-ui/core/colors/common';

/**
 * Interface that contains all the colours of the registration portal. The used palette deliberately
 * is as simple as possible, to ensure consistency and make changes straightforward.
 */
export const Colors = {
    /**
     * The dark, contrasting background colour used in the application.
     */
    kContrastBackgroundColor: brown[900],

    /**
     * Text colour to use on the contrasting background color.
     */
    kContrastForegroundColor: common.white,

    /**
     * Text colour for hyperlinks.
     */
    kHyperlinkColor: brown[800],
};
