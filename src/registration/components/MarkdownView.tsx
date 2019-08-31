// Copyright 2019 Peter Beverloo. All rights reserved.
// Use of this source code is governed by the MIT license, a copy of which can
// be found in the LICENSE file.

import React from 'react';
import ReactMarkdown  from 'react-markdown';
import { Link } from 'react-router-dom';

import { Theme } from '@material-ui/core/styles/createMuiTheme';
import { WithStyles, default as withStyles } from '@material-ui/core/styles/withStyles';
import createStyles from '@material-ui/core/styles/createStyles';

const styles = (theme: Theme) =>
    createStyles({
        root: {
            padding: theme.spacing(0, 2),

            // Render most text according to Material's body1 style.
            ...theme.typography.body1,

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
 * Properties available for the <MarkdownView> component.
 */
interface MarkdownViewProperties {
    /**
     * Markdown content that should be displayed in this view.
     */
    content: string;
}

/**
 * Utility component that enables React routing for links internal to the application.
 */
const RouterLink = (props: HTMLAnchorElement) => {
    return !props.href.startsWith('http') ? <Link to={props.href}>{props.children}</Link>
                                          : <a href={props.href}>{props.children}</a>;
};

/**
 * The <MarkdownView> component displays a given source of Markdown content in a formatted way,
 * consistent throughout the Registration application. Links will be converted to either anchors or
 * to <Link> elements used by react-router.
 */
class MarkdownViewBase extends React.PureComponent<MarkdownViewProperties & WithStyles<typeof styles>> {
    render(): JSX.Element {
        const { classes, content } = this.props;

        return <ReactMarkdown className={classes.root}
                              renderers={{ link: RouterLink }}
                              source={content} />;
    }
}

export const MarkdownView = withStyles(styles)(MarkdownViewBase);
