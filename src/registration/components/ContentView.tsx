// Copyright 2019 Peter Beverloo. All rights reserved.
// Use of this source code is governed by the MIT license, a copy of which can
// be found in the LICENSE file.

import React from 'react';
import { RouteComponentProps } from 'react-router-dom';

import { MarkdownView } from './MarkdownView';
import { RegistrationProperties } from '../RegistrationProperties';

type Properties = RegistrationProperties & RouteComponentProps;

/**
 * The <ContentView> component is responsible for displaying content fetched from the API. The raw
 * string will be converted from Markdown to HTML prior to being displayed.
 */
export class ContentView extends React.PureComponent<Properties> {
    render(): JSX.Element {
        const { contentProvider, match } = this.props;

        const content = contentProvider.hasPage(match.url)
                            ? contentProvider.getPageContent(match.url)
                            : contentProvider.getErrorPageContent();

        return <MarkdownView content={content} />;
    }
}
