// Copyright 2019 Peter Beverloo. All rights reserved.
// Use of this source code is governed by the MIT license, a copy of which can
// be found in the LICENSE file.

import mockConsole from 'jest-mock-console';

import { ConfigurationImpl } from '../base/ConfigurationImpl';
import { ContentProvider } from './ContentProvider';
import { IContent } from '../api/IContent';

describe('ContentProvider', () => {
    it('should be able to distinguish the home page from leaf pages', () => {
        const contentProvider = new ContentProvider();

        const kContent: IContent = {
            lastUpdate: 123456,
            pages: [
                { url: '/',     content: 'home page' },
                { url: '/404',  content: 'error page' },
                { url: '/foo',  content: 'leaf page #1' },
                { url: '/bar',  content: 'leaf page #2' }
            ]
        };

        expect(contentProvider.initializeWithContent(kContent)).toBeTruthy();

        expect(contentProvider.hasPage('/')).toBeTruthy();
        expect(contentProvider.hasPage('/404')).toBeTruthy();
        expect(contentProvider.hasPage('/foo')).toBeTruthy();
        expect(contentProvider.hasPage('/bar')).toBeTruthy();

        // Verify that the page list includes the page in insertion order, with the special-cased
        // pages removed from the list.
        expect(contentProvider.getPageList()).toEqual(['/foo', '/bar']);
    });

    it('should fail when the home page could not be found', () => {
        const contentProvider = new ContentProvider();
        const restoreConsole = mockConsole();

        const kContent: IContent = {
            lastUpdate: 123456,
            pages: [
                { url: '/404',  content: 'not found' },
                { url: '/foo',  content: 'leaf page #1' },
                { url: '/bar',  content: 'leaf page #2' }
            ]
        };

        expect(contentProvider.initializeWithContent(kContent)).toBeFalsy();
        expect(console.error).toHaveBeenCalledTimes(1);

        restoreConsole();
    });

    it('should fail when the error page could not be found', () => {
        const contentProvider = new ContentProvider();
        const restoreConsole = mockConsole();

        const kContent: IContent = {
            lastUpdate: 123456,
            pages: [
                { url: '/',     content: 'home page' },
                { url: '/foo',  content: 'leaf page #1' },
                { url: '/bar',  content: 'leaf page #2' }
            ]
        };

        expect(contentProvider.initializeWithContent(kContent)).toBeFalsy();
        expect(console.error).toHaveBeenCalledTimes(1);

        restoreConsole();
    });

    it('should fail when there are duplicate URLs', () => {
        const contentProvider = new ContentProvider();
        const restoreConsole = mockConsole();

        const kContent: IContent = {
            lastUpdate: 123456,
            pages: [
                { url: '/',     content: 'homepage' },
                { url: '/404',  content: 'not found' },
                { url: '/foo',  content: 'leaf page #1' },
                { url: '/foo',  content: 'leaf page #2' }
            ]
        };

        expect(contentProvider.initializeWithContent(kContent)).toBeFalsy();
        expect(console.error).toHaveBeenCalledTimes(1);

        restoreConsole();
    });

    it('should be able to return the content for a request URL', () => {
        const contentProvider = new ContentProvider();

        const kContent: IContent = {
            lastUpdate: 123456,
            pages: [
                { url: '/',     content: 'homepage' },
                { url: '/404',  content: 'not found' },
                { url: '/foo',  content: 'leaf page #1' }
            ]
        };

        expect(contentProvider.initializeWithContent(kContent)).toBeTruthy();

        expect(contentProvider.hasPage('/foo')).toBeTruthy();

        expect(contentProvider.getErrorPageContent()).toStrictEqual('not found');
        expect(contentProvider.getPageContent('/')).toStrictEqual('homepage');
        expect(contentProvider.getPageContent('/foo')).toStrictEqual('leaf page #1');
    });

    it('should be able to return the content last update time', () => {
        const contentProvider = new ContentProvider();

        const kContent: IContent = {
            lastUpdate: 123456,
            pages: [
                { url: '/',     content: 'homepage' },
                { url: '/404',  content: 'not found' },
                { url: '/foo',  content: 'leaf page #1' }
            ]
        };

        expect(contentProvider.initializeWithContent(kContent)).toBeTruthy();
        expect(contentProvider.getLastUpdate()).toEqual(123456);
    });

    it('should throw when accessing properties before loading succeeds', () => {
        const contentProvider = new ContentProvider();

        expect(() => contentProvider.getPageList()).toThrowError();
        expect(() => contentProvider.getPageContent('/foo')).toThrowError();
        expect(() => contentProvider.getErrorPageContent()).toThrowError();
        expect(() => contentProvider.hasPage('/foo')).toThrowError();
        expect(() => contentProvider.getLastUpdate()).toThrowError();
    });
});
