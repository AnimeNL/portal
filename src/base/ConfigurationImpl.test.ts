// Copyright 2019 Peter Beverloo. All rights reserved.
// Use of this source code is governed by the MIT license, a copy of which can
// be found in the LICENSE file.

import { ConfigurationImpl } from './ConfigurationImpl';

describe('ConfigurationImpl', () => {
    it('has the ability to programmatically override configuration', () => {
        const configuration = new ConfigurationImpl();

        const originalEndpoint = configuration.getEnvironmentEndpoint();

        configuration.setEnvironmentEndpoint('custom-endpoint');

        expect(configuration.getEnvironmentEndpoint()).not.toEqual(originalEndpoint);
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
