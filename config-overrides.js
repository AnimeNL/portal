// Copyright 2019 Peter Beverloo. All rights reserved.
// Use of this source code is governed by the MIT license, a copy of which can
// be found in the LICENSE file.

const WorkboxWebpackPlugin = require('workbox-webpack-plugin');

module.exports = {
    webpack: function(config, env) {
        if (config.mode !== 'production')
            return config;

        // (1) Remove the existing GenerateSW call from the Webpack configuration.
        config.plugins = config.plugins.filter(plugin => {
            return plugin.constructor.name !== 'GenerateSW';
        });

        // (2) Add our instance of the Workbox configuration.
        config.plugins.push(
            new WorkboxWebpackPlugin.GenerateSW({
                importWorkboxFrom: 'cdn',
                clientsClaim: true,
                skipWaiting: true,

                cacheId: 'volunteer-portal-cache',

                exclude: [/\.map$/, /asset-manifest\.json$/],

                runtimeCaching: [
                    // Caching rules for API calls made by the application.
                    {
                        urlPattern: new RegExp('/api/(environment|event)'),
                        handler: 'NetworkFirst',
                        options: {
                            networkTimeoutSeconds: 3,
                        },
                    },
                    {
                        urlPattern: new RegExp('/api/login'),
                        handler: 'NetworkOnly',
                    },

                    // Caching rules for third party dependencies.
                    {
                        urlPattern: new RegExp('https://fonts.(?:googleapis|gstatic).com/(.*)'),
                        handler: 'CacheFirst',
                        options: {
                            cacheName: 'google-fonts',
                            cacheableResponse: {
                                statuses: [0, 200],
                            },
                            expiration: {
                                maxEntries: 30,
                            },
                        },
                    },

                    // Caching rules specific to AnimeCon.
                    {
                        urlPattern: new RegExp('/avatars/'),
                        handler: 'CacheFirst',
                        options: {
                            cacheName: 'volunteer-portal-avatars',
                            expiration: {
                                maxEntries: 300,
                            },
                        },
                    },
                    {
                        urlPattern: new RegExp('/static/images/'),
                        handler: 'CacheFirst',
                        options: {
                            cacheName: 'volunteer-portal-images',
                            expiration: {
                                maxAgeSeconds: 3 * 24 * 60 * 60,  // three days
                            },
                        },
                    },
                ],

                navigateFallback: config.output.publicPath + 'index.html',
                navigateFallbackWhitelist: [
                    // URLs that are logically part of our application.
                    new RegExp('^/(internals|schedule|volunteers)'),
                    new RegExp('^/$'),

                    // TODO: Include certain tools in the caching?
                ],

            }));

        // (3) Return the new configuration.
        return config;
    }
}
