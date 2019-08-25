// Copyright 2019 Peter Beverloo. All rights reserved.
// Use of this source code is governed by the MIT license, a copy of which can
// be found in the LICENSE file.

import { ConfigurationImpl } from './ConfigurationImpl';

describe('ConfigurationImpl', () => {
    it('has the ability to programmatically override configuration', () => {
        const configuration = new ConfigurationImpl();

        const originalContentEndpoint = configuration.getContentEndpoint();
        const originalEnvironmentEndpoint = configuration.getEnvironmentEndpoint();

        configuration.setContentEndpoint('custom-endpoint');
        configuration.setEnvironmentEndpoint('custom-endpoint');

        expect(configuration.getContentEndpoint()).not.toEqual(originalContentEndpoint);
        expect(configuration.getEnvironmentEndpoint()).not.toEqual(originalEnvironmentEndpoint);
    });

    it('has the ability to override configuration based on the environment', () => {
        const defaultConfiguration = new ConfigurationImpl();
        const hostname = 'https://example.com';

        process.env.REACT_APP_API_HOST = hostname;
        const environmentConfiguration = new ConfigurationImpl();

        expect(defaultConfiguration.getEnvironmentEndpoint()).not.toContain(hostname);
        expect(environmentConfiguration.getEnvironmentEndpoint()).toContain(hostname);

        expect(environmentConfiguration.getEnvironmentEndpoint()).not.toEqual(
            defaultConfiguration.getEnvironmentEndpoint());
    });
});
