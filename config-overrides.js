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
                        urlPattern: new RegExp('^/api/'),
                        handler: 'StaleWhileRevalidate',
                    },

                    // Caching rules for volunteer avatars. This rule is specific to AnimeCon.
                    {
                        urlPattern: new RegExp('^/avatars/'),
                        handler: 'CacheFirst',
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
