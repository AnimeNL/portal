// Copyright 2019 Peter Beverloo. All rights reserved.
// Use of this source code is governed by the MIT license, a copy of which can
// be found in the LICENSE file.

import createMuiTheme, { Theme, ThemeOptions } from '@material-ui/core/styles/createMuiTheme';

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
    setDarkThemeEnabled: (enabled: boolean) => void;
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
    static setDarkThemeEnabled(enabled: boolean) {
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
                    type: ThemeProvider.isDarkThemeEnabled() ? 'dark' : 'light',
                    primary: {
                        main: '#1565c0'
                    },
                    action: {
                        selected: '#E8EAF6',
                    },
                },
            });
        }

        return ThemeProvider.cachedTheme;
    }
}
