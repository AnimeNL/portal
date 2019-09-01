// Copyright 2019 Peter Beverloo. All rights reserved.
// Use of this source code is governed by the MIT license, a copy of which can
// be found in the LICENSE file.

import React from 'react';
import { RouteComponentProps } from 'react-router-dom';

import { MarkdownView } from './MarkdownView';
import { RegistrationProperties } from '../RegistrationProperties';
import { UserControllerContext } from '../controllers/UserControllerContext';

import { Theme } from '@material-ui/core/styles/createMuiTheme';
import Typography from '@material-ui/core/Typography';
import { WithStyles, default as withStyles } from '@material-ui/core/styles/withStyles';
import createStyles from '@material-ui/core/styles/createStyles';

/**
 * These pathnames map to pages that we can obtain through the content provider.
 */
const kRegistrationConfirm = '/registration/internal/confirm';
const kRegistrationIntro = '/registration/internal/intro';

const styles = (theme: Theme) =>
    createStyles({
        root: {
            padding: theme.spacing(2),
        }
    });

/**
 * State internal to the <RegistrationViewBase> component.
 */
interface InternalState {
    /**
     * Cached React component for the introduction text. Created at mount time.
     */
    introText?: JSX.Element,
}

/**
 * Joint type definition of the Registration application properties and routing + styling ones.
 */
type Properties = RegistrationProperties & RouteComponentProps & WithStyles<typeof styles>;

/**
 * The registration view provides users with the ability to sign up for volunteering at this event.
 * We'll ask them for all necessary information, which will be validated and uploaded when ready.
 */
class RegistrationViewBase extends React.PureComponent<Properties, InternalState> {
    static contextType = UserControllerContext;
    
    /**
     * The user context available to the registration form. Will be set by React.
     */
    context!: React.ContextType<typeof UserControllerContext>;

    state: InternalState = {};

    componentDidMount() {
        const { contentProvider } = this.props;

        // Cache the registration introduction if it's known to the content provider.
        if (!contentProvider.hasPage(kRegistrationIntro))
            return;

        const content = contentProvider.getPageContent(kRegistrationIntro);

        this.setState({
            introText: <MarkdownView content={content} />
        });
    }

    render(): JSX.Element {
        const { classes } = this.props;
        const { introText } = this.state;

        return (
            <>
                {introText}
            </>
        );
    }
}

export const RegistrationView = withStyles(styles)(RegistrationViewBase);
