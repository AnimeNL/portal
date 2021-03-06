// Copyright 2019 Peter Beverloo. All rights reserved.
// Use of this source code is governed by the MIT license, a copy of which can
// be found in the LICENSE file.

import React from 'react';
import ReactMarkdown  from 'react-markdown';
import bind from 'bind-decorator';

import { UpdateTextDialog } from './UpdateTextDialog';

import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import SpeakerNotesIcon from '@material-ui/icons/SpeakerNotesOffOutlined';
import { Theme } from '@material-ui/core/styles/createMuiTheme';
import Typography from '@material-ui/core/Typography';
import createStyles from '@material-ui/core/styles/createStyles';
import { fade } from '@material-ui/core/styles/colorManipulator';
import withStyles, { WithStyles } from '@material-ui/core/styles/withStyles';

const styles = (theme: Theme) =>
    createStyles({
        expanded: {},

        titleMutable: {
            color: fade(theme.palette.text.primary, 0.3),
        },
        titleMutableIcon: {
            position: 'relative',
            top: 3,
            fontSize: 'inherit',
            marginLeft: theme.spacing(1),
        },

        details: {
            display: 'block',
            padding: `0 ${theme.spacing(3)}px ${theme.spacing(2)}px`,
        },
        detailsMutable: {
            marginTop: 0 - theme.spacing(1),

            display: 'block',
            margin: '-4px 12px 12px 12px',
            padding: theme.spacing(1.5),
            cursor: 'pointer',

            border: '1px dashed ' + theme.palette.divider,

            WebkitTapHighlightColor: 'transparent',
            WebkitUserSelect: 'none',
            userSelect: 'none',

            transition: theme.transitions.create(['background-color']),

            '&:hover': {
                backgroundColor: fade(theme.palette.background.default, 0.25),
            },
        },

        markdown: {
            '& a': { color: theme.palette.text.secondary },
            '& p': { marginTop: 0 },
            '& strong': { fontWeight: 600 },
            '&> :last-child': { marginBottom: 0 },
        },

        summaryContent: {
            margin: `${theme.spacing(1)}px 0`,

            '&$expanded': {
                margin: '16px 0',
            },
        },
        summaryIcon: {
            padding: theme.spacing(1),
        },
        summaryRoot: {
            minHeight: 40,

            '&$expanded': {
                minHeight: 0,
            },
        },
    });

/**
 * Properties accepted by the <ExpandableDescriptionPaper> component.
 */
interface Properties {
    /**
     * Whether the text has to be rendered as markdown.
     */
    markdown?: boolean;

    /**
     * Whether the contents of this input box are mutable by the user.
     */
    mutable?: boolean;

    /**
     * Title of the collapsed paper, always displayed.
     */
    title: string;

    /**
     * The text that should be displayed in the panel, if any.
     */
    text?: string;

    /**
     * Event that should be called when the description changes.
     */
    onDescriptionChange?: (description: string) => Promise<boolean>;
}

/**
 * State for the <ExpandableDescriptionPaper> component.
 */
interface State {
    /**
     * Whether the content editor for the instructions is currently active.
     */
    contentEditorActive: boolean;
}

/**
 * The <ExpandableDescriptionPaper> component is able to display a titled sheet of paper with
 * contents that are hidden by default, which will only be presented after being activated by the
 * user. People with the "edit-content" flag can add more information here if so desired.
 */
class ExpandableDescriptionPaper extends React.Component<Properties & WithStyles<typeof styles>, State> {
    state: State = {
        contentEditorActive: false,
    }

    /**
     * Called when the content editor should be opened.
     */
    @bind
    onOpenDialog(): void {
        if (!this.props.mutable)
          return;

        this.setState({
            contentEditorActive: true,
        })
    }

    /**
     * Called when the content editor should be closed without changes.
     */
    @bind
    onCloseDialog(): void {
        this.setState({
            contentEditorActive: false,
        })
    }

    /**
     * Called when the content editor should be closed after the given |text| gets updated.
     */
    @bind
    async onSaveDialog(text: string): Promise<boolean> {
        const { onDescriptionChange } = this.props;

        const result = onDescriptionChange ? await onDescriptionChange(text)
                                           : false;

        if (!result)
            return false;

        this.setState({
            contentEditorActive: false,
        });

        return true;
    }

    render() {
        const { classes, markdown, mutable, text, title } = this.props;
        const { contentEditorActive } = this.state;

        const isEmptyMutable = mutable && !text;

        return (
            <ExpansionPanel>

                <ExpansionPanelSummary classes={{ content: classes.summaryContent,
                                                  expandIcon: classes.summaryIcon,
                                                  expanded: classes.expanded,
                                                  root: classes.summaryRoot }}
                                       expandIcon={<ExpandMoreIcon />}>

                    <Typography variant="body1"
                                className={isEmptyMutable ? classes.titleMutable : undefined}>

                        {title}
                        { isEmptyMutable && <SpeakerNotesIcon className={classes.titleMutableIcon} /> }

                    </Typography>

                </ExpansionPanelSummary>

                <ExpansionPanelDetails onClick={this.onOpenDialog}
                                       className={mutable ? classes.detailsMutable
                                                          : classes.details}>

                    { markdown ? <ReactMarkdown className={classes.markdown}
                                                disallowedTypes={[ 'table', 'inlineCode', 'html', 'virtualHtml' ]}
                                                source={text} />
                               : text }

                    { isEmptyMutable && <i>Click to add content to this box.</i> }

                </ExpansionPanelDetails>

                <UpdateTextDialog onClose={this.onCloseDialog}
                                  onSave={this.onSaveDialog}
                                  open={contentEditorActive}
                                  text={text}
                                  title="Shift instructions" />

            </ExpansionPanel>
        );
    }
}

const StyledExpandableDescriptionPaper = withStyles(styles)(ExpandableDescriptionPaper);
export { StyledExpandableDescriptionPaper as ExpandableDescriptionPaper };
