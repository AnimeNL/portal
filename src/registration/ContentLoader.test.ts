// Copyright 2019 Peter Beverloo. All rights reserved.
// Use of this source code is governed by the MIT license, a copy of which can
// be found in the LICENSE file.

import mockConsole from 'jest-mock-console';

import { ConfigurationImpl } from '../base/ConfigurationImpl';
import { ContentLoader } from './ContentLoader';

const mockServer = require('mockttp').getLocal({ cors: true });

describe('ContentLoader', () => {
    beforeEach(() => mockServer.start());
    afterEach(() => mockServer.stop());

    function createContentLoader(status: number, content: object): ContentLoader {
        const configuration = new ConfigurationImpl();
        const endpoint = mockServer.url + '/api/content';

        configuration.setContentEndpoint(endpoint);

        mockServer.get(endpoint).thenJson(status, content);

        return new ContentLoader(configuration);
    }

    it('should be able to load valid content from the API', async () => {
        const contentLoader = createContentLoader(200, {
            lastUpdate: 123456,
            pages: [
                { url: '/foo', content: 'Hello' },
                { url: '/bar', content: 'World' }
            ]
        });

        expect(await contentLoader.initialize()).toBeTruthy();

        const content = contentLoader.getContent();

        expect(content.lastUpdate).toEqual(123456);

        expect(content.pages.length).toEqual(2);

        expect(content.pages[0].url).toStrictEqual('/foo');
        expect(content.pages[0].content).toStrictEqual('Hello');

        expect(content.pages[1].url).toStrictEqual('/bar');
        expect(content.pages[1].content).toStrictEqual('World');
    });

    it('should fail when the content is not available', async () => {
        const contentLoader = createContentLoader(404, {});
        const restoreConsole = mockConsole();

        expect(await contentLoader.initialize()).toBeFalsy();
        expect(console.error).toHaveBeenCalledTimes(1);

        restoreConsole();
    });

    it('should fail when the content is invalid (IContent)', async () => {
        const contentLoader = createContentLoader(200, {
            lastUpdate: 123456,
            pages: 'qux'
        });

        const restoreConsole = mockConsole();

        expect(await contentLoader.initialize()).toBeFalsy();
        expect(console.error).toHaveBeenCalledTimes(1);

        restoreConsole();
    });

    it('should fail when the content is invalid (IContentPage)', async () => {
        const contentLoader = createContentLoader(200, {
            lastUpdate: 123456,
            pages: [
                { hello: 'world' }
            ]
        });

        const restoreConsole = mockConsole();

        expect(await contentLoader.initialize()).toBeFalsy();
        expect(console.error).toHaveBeenCalledTimes(1);

        restoreConsole();
    });

    it('should throw when accessing uninitialized content', () => {
        const contentLoader = createContentLoader(404, {});

        expect(() => contentLoader.getContent()).toThrowError();
    });
});
