// Copyright 2019 Peter Beverloo. All rights reserved.
// Use of this source code is governed by the MIT license, a copy of which can
// be found in the LICENSE file.

import * as React from 'react';
import * as ReactDOM from 'react-dom';
import LoginLayout from '../layouts/LoginLayout';

class Application {
    constructor(container : Element | null) {
        ReactDOM.render(<LoginLayout />, container);
    }
}

export default Application;
