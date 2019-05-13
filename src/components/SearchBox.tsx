// Copyright 2019 Peter Beverloo. All rights reserved.
// Use of this source code is governed by the MIT license, a copy of which can
// be found in the LICENSE file.

import React from 'react';

import InputBase from '@material-ui/core/InputBase';
import SearchIcon from '@material-ui/icons/Search';
import { Theme } from '@material-ui/core/styles/createMuiTheme';
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
    });

/**
 * Properties accepted by the <SearchBox> component.
 */
interface Properties {

}

/**
 * State maintained by the <SearchBox> component.
 */
interface State {
    /**
     * Whether the search box should be expanded. It will take up the width of the entire header
     * except for the control buttons on either side.
     */
    expanded: boolean;
}

/**
 * The search box is a component that can be displayed on the page header that enables users to
 * quickly search through the event's volunteers, locations and events.
 */
class SearchBox extends React.Component<Properties & WithStyles<typeof styles>, State> {
    state: State = {
        expanded: true,
    };

    render() {
        const { classes } = this.props;

        return (
            <div className={classes.search}>
                <div className={classes.searchIcon}>
                    <SearchIcon />
                </div>

                <InputBase placeholder="Search…"
                           classes={{
                               root: classes.inputRoot,
                               input: classes.inputInput,
                           }} />

            </div>
        );
    }
}

const StyledSearchBox = withStyles(styles)(SearchBox);
export { StyledSearchBox as SearchBox };
