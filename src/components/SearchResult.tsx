// Copyright 2019 Peter Beverloo. All rights reserved.
// Use of this source code is governed by the MIT license, a copy of which can
// be found in the LICENSE file.

import { Link } from 'react-router-dom';
import React from 'react';
import escapeStringRegexp from 'escape-string-regexp';

import Avatar from '@material-ui/core/Avatar';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';
import SvgIcon from '@material-ui/core/SvgIcon';
import { Theme } from '@material-ui/core/styles/createMuiTheme';
import Typography from '@material-ui/core/Typography';
import createStyles from '@material-ui/core/styles/createStyles';
import withStyles, { WithStyles } from '@material-ui/core/styles/withStyles';

// Naive algorithm for getting the initials for a particular name: selecting the first and the last
// capital available in the name.
const nameInitials = (name: string) =>
    name.replace(/[^A-Z]/g, '').replace(/^(.).*(.)/g, '$1$2');

const styles = (theme: Theme) =>
    createStyles({
        link: {
            textDecoration: 'none',
            color: 'inherit',
        },
        noWrap: {
            overflow: 'hidden',
            textOverflow: 'ellipsis',
        },
        hightlight: {
            fontWeight: 'bold',
        },
    });

/**
 * Structure of an individual search result that is to be rendered.
 */
export interface SearchResultProps {
    /**
     * Colour of the icon that is to be displayed. Only applicable for 'icon' types.
     */
    iconColor?: string;

    /**
     * Source of the icon that should be displayed.
     */
    iconSrc?: string;

    /**
     * Type of icon that should be displayed in front of the search result.
     */
    iconType: "avatar" | "icon";

    /**
     * The (lowercase) query that was done
     */
    query: string;

    /**
     * Label describing the result to the search query.
     */
    label: string;

    /**
     * URL of the page the user should be taken to when clicking on this result.
     */
    to: string;
}

class SearchResult extends React.Component<SearchResultProps & WithStyles<typeof styles>> {
    render() {
        const { classes, iconColor, iconSrc, iconType, query, label, to } = this.props;

        const isAvatar = iconType === 'avatar';
        const isIcon = iconType === 'icon';

        const regex = new RegExp('(' + escapeStringRegexp(query) + ')', 'gi');
        const highlightedLabel = (
          <Typography noWrap>
              { label.split(regex).map((part, i) => {
                  const className = part.toLowerCase() === query ? classes.hightlight : undefined;
                  return <span key={i} className={className}>{part}</span>;
              })}
          </Typography>
        );

        return (
            <Link className={classes.link} to={to}>
                <ListItem button>

                    { isAvatar &&
                        <ListItemAvatar>
                            <Avatar src={iconSrc}>
                                {nameInitials(label)}
                            </Avatar>
                        </ListItemAvatar> }

                    { isIcon &&
                        <ListItemAvatar>
                            <Avatar style={{ backgroundColor: iconColor }}>
                                <SvgIcon htmlColor="white">
                                    <use xlinkHref={iconSrc} />
                                </SvgIcon>
                            </Avatar>
                        </ListItemAvatar> }

                    <ListItemText className={classes.noWrap}
                                  disableTypography
                                  primary={highlightedLabel} />

                </ListItem>
            </Link>
        );
    }
}

const StyledSearchResult = withStyles(styles)(SearchResult);
export { StyledSearchResult as SearchResult };
