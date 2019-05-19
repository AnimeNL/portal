// Copyright 2019 Peter Beverloo. All rights reserved.
// Use of this source code is governed by the MIT license, a copy of which can
// be found in the LICENSE file.

import { RouteComponentProps, withRouter } from 'react-router-dom';
import React from 'react';

/**
 * The <ScrollBehaviour /> component is responsible for the page's scroll position when navigating
 * between different views.
 *
 * @see https://reacttraining.com/react-router/web/guides/scroll-restoration
 */
class ScrollBehaviour extends React.Component<RouteComponentProps> {
    /**
     * Called when the component has to update, i.e. when the routing properties change.
     */
    componentDidUpdate(previousProps: RouteComponentProps) {
        if (previousProps.location.pathname === this.props.location.pathname)
            return;

        window.scrollTo(0, 0);
    }

    /**
     * The <ScrollBehaviour /> component does not render anything.
     */
    render() {
        return null;
    }
}

const RoutedScrollBehaviour = withRouter(ScrollBehaviour);
export { RoutedScrollBehaviour as ScrollBehaviour };
