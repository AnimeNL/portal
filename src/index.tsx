// Copyright 2019 Peter Beverloo. All rights reserved.
// Use of this source code is governed by the MIT license, a copy of which can
// be found in the LICENSE file.

import { ApplicationLoader } from './base/ApplicationLoader';

const loader = new ApplicationLoader();
loader.initialize().catch(exception => {
    // Always display application runtime exceptions on the page as always-on-top elements.
    const element = document.createElement('div');

    element.innerText = exception;
    element.setAttribute(
        'style',
        'position: fixed; top: 0; left: 0; right: 0; background-color: #ff5555; padding: 1em');
    
    document.body.appendChild(element);
});
