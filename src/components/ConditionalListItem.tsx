// Copyright 2019 Peter Beverloo. All rights reserved.
// Use of this source code is governed by the MIT license, a copy of which can
// be found in the LICENSE file.

import React from 'react';

import ListItem from '@material-ui/core/ListItem';

/**
 * Properties accepted by the <ConditionalListItem> component.
 */
interface Properties {
    /**
     * Whether this list item should be presented as a button.
     */
    button: boolean;

    /**
     * Child component(s) of the list item.
     */
    children?: React.ReactNode;

    /**
     * Class name to apply to the list item.
     */
    className?: string;

    /**
     * Whether the render a divider at the bottom of the list item.
     */
    divider?: boolean;
}

/**
 * Work-around for an issue where the `button` property for the <ListItem> component became a
 * discriminant for the component's properties, meaning it can't be set dynamically.
 *
 * @see https://github.com/mui-org/material-ui/pull/15049
 */
function ConditionalListItem(props: Properties): JSX.Element {
  const { button, children, className, divider } = props;

  if (button)
    return <ListItem button className={className} divider={divider}>{children}</ListItem>;

  return <ListItem className={className} divider={divider}>{children}</ListItem>;
}

export default ConditionalListItem;
