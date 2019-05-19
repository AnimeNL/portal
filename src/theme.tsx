// Copyright 2019 Peter Beverloo. All rights reserved.
// Use of this source code is governed by the MIT license, a copy of which can
// be found in the LICENSE file.

import amber from '@material-ui/core/colors/amber';
import blue from '@material-ui/core/colors/blue'
import blueGrey from '@material-ui/core/colors/blueGrey';
import brown from '@material-ui/core/colors/brown';
import createMuiTheme, { Theme, ThemeOptions } from '@material-ui/core/styles/createMuiTheme';
import grey from '@material-ui/core/colors/grey';
import indigo from '@material-ui/core/colors/indigo';

/**
 * Properties that differ between our dark- and light theme configurations.
 */
interface ThemeProperties {
    /**
     * Whether this theme defines a light or dark theme.
     */
    type: "light" | "dark";

    /**
     * Background color for event rows detailing active sessions.
     */
    activeSessionBackgroundColor: React.CSSProperties['color'];

    /**
     * Background color of the application header.
     */
    headerBackgroundColor: React.CSSProperties['color'];

    /**
     * Background color of active items in the application menu.
     */
    menuActiveBackgroundColor: React.CSSProperties['color'];

    /**
     * Background color for event rows detailing past sessions.
     */
    pastSessionBackgroundColor: React.CSSProperties['color'];
}

/**
 * Augment the Theme and ThemeOptions objects to allow for additional properties.
 */
declare module '@material-ui/core/styles/createMuiTheme' {
    interface Theme {
        /**
         * Background color for event rows detailing active sessions.
         */
        activeSessionBackgroundColor: React.CSSProperties['color'];

        /**
         * Background color of the application header.
         */
        headerBackgroundColor: React.CSSProperties['color'];

        /**
         * Background color of active items in the application menu.
         */
        menuActiveBackgroundColor: React.CSSProperties['color'];

        /**
         * Background color for event rows detailing past sessions.
         */
        pastSessionBackgroundColor: React.CSSProperties['color'];
    }

    interface ThemeOptions {
        activeSessionBackgroundColor?: React.CSSProperties['color'];
        headerBackgroundColor?: React.CSSProperties['color'];
        menuActiveBackgroundColor?: React.CSSProperties['color'];
        pastSessionBackgroundColor?: React.CSSProperties['color'];
    }
}

/**
 * Interface that must be provided for
 */
export interface ThemeDelegate {
    /**
     * Returns whether dark theme is currently enabled.
     */
    isDarkThemeEnabled: () => boolean;

    /**
     * Sets whether dark theme should be enabled.
     */
    setDarkThemeEnabled: (enabled: boolean | undefined) => void;
}

/**
 * Provider that manages the theme for the volunteer portal. It describes the default settings,
 * colours and typography properties. Dark Theme can be enabled for the page as well.
 *
 * @see https://material-ui.com/customization/themes/
 */
export class ThemeProvider {
    /**
     * The delegate that's responsible for controlling dark theme state.
     */
    private static delegate?: ThemeDelegate;

    /**
     * Cached instance of the Theme. Will be created once for the application's lifecycle.
     */
    private static cachedTheme?: Theme;

    /**
     * Sets the delegate that's responsible for controlling dark theme state.
     */
    static setDelegate(delegate: ThemeDelegate): void {
        ThemeProvider.delegate = delegate;
    }

    /**
     * Returns whether dark theme is enabled for the portal.
     */
    static isDarkThemeEnabled(): boolean {
        if (!ThemeProvider.delegate)
            return false;

        return ThemeProvider.delegate.isDarkThemeEnabled();
    }

    /**
     * Toggles whether dark theme should be enabled for the portal. Unless this is changed at page
     * load time, the page should be refreshed for this change to take effect.
     */
    static setDarkThemeEnabled(enabled: boolean | undefined) {
        if (!ThemeProvider.delegate)
            throw new Error('Unable to update dark theme state: no delegate');

        ThemeProvider.delegate.setDarkThemeEnabled(enabled);
    }

    /**
     * Returns the theme that should be used for rendering the volunteer portal. Will be cached, and
     * return exactly the same instance after the first call to this method.
     */
    static getTheme(): Theme {
        if (ThemeProvider.cachedTheme === undefined) {
            const properties = ThemeProvider.getThemeProperties();

            ThemeProvider.cachedTheme = createMuiTheme({
                mixins: {
                    toolbar: {
                        minHeight: 56,
                        '@media (min-width:600px)': {
                            minHeight: 64,
                        },
                    },
                },
                palette: {
                    type: properties.type,
                    primary: {
                        main: blue[800]
                    },
                    action: {
                        selected: indigo[50],
                    },
                },
                activeSessionBackgroundColor: properties.activeSessionBackgroundColor,
                headerBackgroundColor: properties.headerBackgroundColor,
                menuActiveBackgroundColor: properties.menuActiveBackgroundColor,
                pastSessionBackgroundColor: properties.pastSessionBackgroundColor,
            });
        }

        return ThemeProvider.cachedTheme;
    }

    /**
     * Returns the theme-specific properties that visually distinguish the portal between light and
     * dark theme. Each property must be defined twice.
     */
    private static getThemeProperties(): ThemeProperties {
        if (ThemeProvider.isDarkThemeEnabled()) {
            return {
                type: 'dark',
                activeSessionBackgroundColor: brown[900],
                headerBackgroundColor: grey[900],
                menuActiveBackgroundColor: grey[700],
                pastSessionBackgroundColor: '#353535',  // grey[850]ish
            };
        } else {
            return {
                type: 'light',
                activeSessionBackgroundColor: amber[50],
                headerBackgroundColor: blue[800],
                menuActiveBackgroundColor: indigo[50],
                pastSessionBackgroundColor: blueGrey[50],
            };
        }
    }
}
