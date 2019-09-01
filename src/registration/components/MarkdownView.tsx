// Copyright 2019 Peter Beverloo. All rights reserved.
// Use of this source code is governed by the MIT license, a copy of which can
// be found in the LICENSE file.

import React from 'react';
import ReactMarkdown  from 'react-markdown';
import { Link } from 'react-router-dom';

import { Colors } from '../Colors';

import Button from '@material-ui/core/Button';
import HowToRegIcon from '@material-ui/icons/HowToReg';
import { Theme } from '@material-ui/core/styles/createMuiTheme';
import { WithStyles, default as withStyles } from '@material-ui/core/styles/withStyles';
import { darken } from '@material-ui/core/styles/colorManipulator';
import createStyles from '@material-ui/core/styles/createStyles';
import makeStyles from '@material-ui/core/styles/makeStyles';
import lightGreen from '@material-ui/core/colors/lightGreen';

const styles = (theme: Theme) =>
    createStyles({
        root: {
            padding: theme.spacing(0, 2),

            // Render most text according to Material's body1 style.
            ...theme.typography.body1,

            '& a': {
                color: Colors.kHyperlinkColor,
            },
            '& > blockquote > p': { margin: 0 },
            '& > blockquote': {
                margin: 0,
                padding: theme.spacing(1, 2),
                backgroundColor: lightGreen[100],
                borderRadius: theme.shape.borderRadius,
            },

            '& h1': {
                fontWeight: 600,
            },
            '& h2, h3, h4, strong': {
                fontWeight: 500,
            },

            '& h3 + p': { marginTop: 0 },
            '& h3': { marginBottom: 0 },
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
 * Style for the registration button.
 */
const useStyles = makeStyles(theme => ({
    root: {
        backgroundColor: Colors.kHyperlinkColor,
        color: theme.palette.getContrastText(Colors.kHyperlinkColor) + ' !important',
        marginBottom: theme.spacing(2),

        '&:hover': {
            backgroundColor: darken(Colors.kHyperlinkColor, theme.palette.tonalOffset),
        }
    },
    button: {
        marginRight: theme.spacing(1),
    }
}));

/**
 * The registration button. This can be rendered in any markdown content by using a definition,
 * which looks as follows:
 * 
 *   [1]: /foo
 * 
 * None of the markup actually matters, it will be discarded. This is a bit of a hack, admittedly.
 */
const RegistrationButton = (): JSX.Element => {
    const classes = useStyles();

    return (
        <Button variant="contained"
                component={Link} to="/registration/aanmelden.html"
                className={classes.root}>

            <HowToRegIcon className={classes.button} />
            Meld je aan!

        </Button>
    );
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
                              renderers={{ definition: RegistrationButton,
                                           link: RouterLink }}
                              source={content} />;
    }
}

export const MarkdownView = withStyles(styles)(MarkdownViewBase);
