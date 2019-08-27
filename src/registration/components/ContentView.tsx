// Copyright 2019 Peter Beverloo. All rights reserved.
// Use of this source code is governed by the MIT license, a copy of which can
// be found in the LICENSE file.

import React from 'react';
import ReactMarkdown  from 'react-markdown';
import { Link, RouteComponentProps } from 'react-router-dom';

import { ContentProvider } from '../ContentProvider';

import { Theme } from '@material-ui/core/styles/createMuiTheme';
import { WithStyles, default as withStyles } from '@material-ui/core/styles/withStyles';
import createStyles from '@material-ui/core/styles/createStyles';

const styles = (theme: Theme) =>
    createStyles({
        markdown: {
            paddingLeft: theme.spacing(2),
            paddingRight: theme.spacing(2),

            '& a': {
                color: '#4E342E',
            },
            '& h1': {
                fontWeight: 600,
            },
            '& h2, strong': {
                fontWeight: 500,
            }
        }
    });

/**
 * Utility component that enables React routing for links internal to the application.
 */
const RouterLink = (props: HTMLAnchorElement) => {
    return !props.href.startsWith('http') ? <Link to={props.href}>{props.children}</Link>
                                          : <a href={props.href}>{props.children}</a>;
};

/**
 * Internal properties made available to the ContentView component.
 */
interface InternalProperties {
    /**
     * The content provider that will source content to be displayed by this component.
     */
    contentProvider: ContentProvider;
}

type Properties = InternalProperties & RouteComponentProps & WithStyles<typeof styles>;

/**
 * The <ContentView> component is responsible for displaying content fetched from the API. The raw
 * string will be converted from Markdown to HTML prior to being displayed.
 */
class ContentViewBase extends React.PureComponent<Properties> {
    render(): JSX.Element {
        const { classes, contentProvider, match } = this.props;

        const content = contentProvider.hasPage(match.url)
                            ? contentProvider.getPageContent(match.url)
                            : contentProvider.getErrorPageContent();

        return <ReactMarkdown className={classes.markdown}
                              renderers={{ link: RouterLink }}
                              source={content} />;
    }
}

export const ContentView = withStyles(styles)(ContentViewBase);
