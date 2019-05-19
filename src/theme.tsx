// Copyright 2019 Peter Beverloo. All rights reserved.
// Use of this source code is governed by the MIT license, a copy of which can
// be found in the LICENSE file.

import blue from '@material-ui/core/colors/blue'
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
     * Background color of the application header.
     */
    headerBackgroundColor: React.CSSProperties['color'];

    /**
     * Background color of active items in the application menu.
     */
    menuActiveBackgroundColor: React.CSSProperties['color'];
}

/**
 * Augment the Theme and ThemeOptions objects to allow for additional properties.
 */
declare module '@material-ui/core/styles/createMuiTheme' {
    interface Theme {
        /**
         * Background color of the application header.
         */
        headerBackgroundColor: React.CSSProperties['color'];

        /**
         * Background color of active items in the application menu.
         */
        menuActiveBackgroundColor: React.CSSProperties['color'];
    }

    interface ThemeOptions {
        headerBackgroundColor?: React.CSSProperties['color'];
        menuActiveBackgroundColor?: React.CSSProperties['color'];
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
                headerBackgroundColor: properties.headerBackgroundColor,
                menuActiveBackgroundColor: properties.menuActiveBackgroundColor,
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
                headerBackgroundColor: grey[900],
                menuActiveBackgroundColor: grey[700],
            };
        } else {
            return {
                type: 'light',
                headerBackgroundColor: blue[800],
                menuActiveBackgroundColor: indigo[50],
            };
        }
    }
}
