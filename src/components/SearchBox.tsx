// Copyright 2019 Peter Beverloo. All rights reserved.
// Use of this source code is governed by the MIT license, a copy of which can
// be found in the LICENSE file.

import React from 'react';
import bind from 'bind-decorator';

import Event from '../app/Event';

import InputBase from '@material-ui/core/InputBase';
import Popover from '@material-ui/core/Popover';
import SearchIcon from '@material-ui/icons/Search';
import { Theme } from '@material-ui/core/styles/createMuiTheme';
import Typography from '@material-ui/core/Typography';
import createStyles from '@material-ui/core/styles/createStyles';
import { fade } from '@material-ui/core/styles/colorManipulator';
import withStyles, { WithStyles } from '@material-ui/core/styles/withStyles';

const styles = (theme: Theme) =>
    createStyles({
        search: {
            position: 'relative',
        },
        searchIcon: {
            width: theme.spacing(5),
            height: '100%',
            position: 'absolute',
            pointerEvents: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
        },

        inputRoot: {
            color: 'inherit',
        },
        inputInput: {
            boxSizing: 'border-box',
            padding: theme.spacing(1, 0, 1, 5),
            borderRadius: theme.shape.borderRadius,

            transition: theme.transitions.create(['width', 'background-color']),

            '&:focus': {
                backgroundColor: fade(theme.palette.common.white, 0.15),

                // Use the full width of the screen, except for:
                //   68px for the menu icon (only on mobile)
                //   48px for the overflow menu (mobile & desktop)
                //   52px for margins on desktop (+1 for unknown reasons);
                //    8px for margins on mobile.
                width: 'calc(100vw - 124px)',
                [theme.breakpoints.up('sm')]: {
                    width: 'calc(100vw - 101px)',
                },
            },

            width: 24,
            height: 36,
        },

        suggestions: {
            marginTop: theme.spacing(.5),

            // Use the full width. Must remain equal to the &:focus block above.
            width: 'calc(100vw - 124px)',
            [theme.breakpoints.up('sm')]: {
                width: 'calc(100vw - 101px)',
            },
        },

        padding: {
            padding: theme.spacing(2),
        },
    });

/**
 * Properties accepted by the <SearchBox> component.
 */
interface Properties {
    /**
     * The event for which this search box is being rendered. This will be used to automatically
     * populate the suggestions box.
     */
    event: Event;
}

/**
 * State maintained by the <SearchBox> component.
 */
interface State {
    /**
     * The anchor to which the suggestions box should be attached.
     */
    anchor?: HTMLElement;

    /**
     * Whether the search box should be expanded. It will take up the width of the entire header
     * except for the control buttons on either side.
     */
    expanded: boolean;

    /**
     * The search query that's currently being searched for.
     */
    query: string;
}

/**
 * The search box is a component that can be displayed on the page header that enables users to
 * quickly search through the event's volunteers, locations and events.
 */
class SearchBox extends React.Component<Properties & WithStyles<typeof styles>, State> {
    state: State = {
        expanded: false,
        query: '',
    };

    /**
     * Called when the search field gains focus. We can now begin to expect search queries to arrive
     * from the `onChange` event on the input field.
     */
    @bind
    onFocus(event: React.FocusEvent<HTMLDivElement>): void {
        this.setState({
            anchor: event.currentTarget,
        });
    }

    /**
     * Called when the search field loses focus, or when the user clicks outside of the suggestions
     * box. Clear the query that the user was searching for, and make sure that any suggestion UI
     * has been appropriately closed.
     */
    @bind
    onClose() {
        this.setState({
            expanded: false,
            query: '',
        });
    }

    /**
     * Called when the value of the search box has changed. This is the appropriate time to fire off
     * a new search query that should populate the suggestions.
     */
    @bind
    onChange(event: React.ChangeEvent<HTMLInputElement>): void {
        const query = event.currentTarget.value;
        const expanded = !!query.length;

        // TODO: Actually perform a search and prepare a number of suggestions.

        this.setState({ expanded, query });
    }

    render() {
        const { classes } = this.props;
        const { anchor, expanded, query } = this.state;

        return (
            <div className={classes.search}>
                <div className={classes.searchIcon}>
                    <SearchIcon />
                </div>

                <InputBase autoComplete="off"
                           placeholder="Search…"
                           value={query}
                           classes={{
                               root: classes.inputRoot,
                               input: classes.inputInput,
                           }}
                           onFocus={this.onFocus}
                           onBlur={this.onClose}
                           onChange={this.onChange} />

                <Popover PaperProps={{ className: classes.suggestions }}
                         anchorEl={anchor}
                         anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
                         disableAutoFocus={true}
                         disableEnforceFocus={true}
                         disableRestoreFocus={true}
                         open={expanded}
                         onClose={this.onClose}>

                    <Typography className={classes.padding}>
                        Suggestions go here
                    </Typography>

                </Popover>

            </div>
        );
    }
}

const StyledSearchBox = withStyles(styles)(SearchBox);
export { StyledSearchBox as SearchBox };
