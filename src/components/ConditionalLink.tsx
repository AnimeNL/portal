// Copyright 2019 Peter Beverloo. All rights reserved.
// Use of this source code is governed by the MIT license, a copy of which can
// be found in the LICENSE file.

import { Link } from 'react-router-dom';
import React from 'react';

/**
 * Properties for the <ConditionalLink> element.
 */
interface Properties {
    className?: string;
    to?: string;

    /**
     * The <ConditionalLink> element accepts children. TypeScript requires us to be explicit.
     */
    children?: React.ReactNode;
}

/**
 * Wraps the <Link> element from the react-router-dom module, but allows for the `to` attribute to
 * be set to `undefined`. If so, no link will be returned.
 */
export default function ConditionalLink(props: Properties) {
    const { children, className, to } = props;

    if (to)
        return <Link className={className} to={to}>{children}</Link>;
    else
        return <>{children}</>;
}
