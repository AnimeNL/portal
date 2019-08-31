// Copyright 2019 Peter Beverloo. All rights reserved.
// Use of this source code is governed by the MIT license, a copy of which can
// be found in the LICENSE file.

import { ApplicationState } from '../base/ApplicationState';
import { ContentLoader } from './ContentLoader';
import { IContent } from '../api/IContent';

/**
 * Special-cased path that indicates the error 404 ("Not Found") page.
 */
export const kErrorPageUrl = '/404';

/**
 * Special-cased path that indicates the home page.
 */
export const kHomePageUrl = '/';

/**
 * Message to include with the exception thrown when data is being accessed before the content
 * provider has been initialized properly.
 */
const kExceptionMessage = 'The content provider has not been successfully initialized yet.';

/**
 * Returns whether the given |url| is a special-cased Url.
 */
const isSpecialUrl = (url: string) => url === kErrorPageUrl || url === kHomePageUrl;

/**
 * The content provider maintains an overview of all the available content pages, and distinguishes
 * between the homepage and leaf pages. It uses the ContentLoader to load content.
 * 
 * As is defined in the API, the provided content must contain at least two entries, but has no
 * upper limit on the number of available pages. 
 * 
 * - The home page must be identified by URL (/).
 * - The error page must be identified by URL (/404).
 * - Neither page will be included in getPageList(), nor can be obtained through getPageContent().
 * - All other pages will be included in getPageList() and can be obtained through getPageContent().
 */
export class ContentProvider {
    private errorPage: string | undefined;
    private pages: Map<string /* url */, string /* content */> = new Map();

    private lastUpdate: number | undefined;
    private initialized: boolean = false;

    /**
     * Initializes the content provider. All data will be loaded, after which the homepage will be
     * identified and the leaf pages will be stored in a request map.
     */
    async initialize(): Promise<boolean> {
        const configuration = ApplicationState.getConfiguration();
        const contentLoader = new ContentLoader(configuration);

        if (await contentLoader.initialize())
            return this.initializeWithContent(contentLoader.getContent());

        return false;
    }

    /**
     * Initializes the content provider with the given |content| instance. A separate method to
     * enable testing of this functionality independently from the ContentLoader.
     */
    initializeWithContent(content: IContent): boolean {
        for (const contentPage of content.pages) {
            const { url } = contentPage;

            if (this.pages.has(url)) {
                console.error(`Duplicate content provided for the given URL (${url}).`);
                return false;
            }

            this.pages.set(url, contentPage.content);
        }

        if (!this.pages.has(kErrorPageUrl)) {
            console.error('No content provided for the error page.');
            return false;
        }

        if (!this.pages.has(kHomePageUrl)) {
            console.error('No content provided for the homepage.');
            return false;
        }

        this.lastUpdate = content.lastUpdate;
        this.initialized = true;

        return true;
    }

    /**
     * Returns an array with the URLs that are available from the content provider. Special URLs
     * will be filtered. Requires the content provider to have been successfully initialized.
     */
    getPageList(): string[] {
        if (!this.initialized)
            throw new Error(kExceptionMessage);

        return Array.from(this.pages.keys()).filter(url => !isSpecialUrl(url));
    }

    /**
     * Returns the page identified for |url|. Requires the content provider to have been
     * successfully initialized, and the page identified by |url| to exist.
     * 
     * @param url The URL to get the page content for.
     */
    getPageContent(url: string): string {
        if (!this.initialized)
            throw new Error(kExceptionMessage);

        const contentPage = this.pages.get(url);
        if (!contentPage)
            throw new Error(`No page could be found for the given URL (${url}).`);        
        
        return contentPage;
    }

    /**
     * Returns the page that should be displayed when the requested page could not been found.
     * Requires the content provider to have been successfully initialized.
     */
    getErrorPageContent(): string {
        if (!this.initialized)
            throw new Error(kExceptionMessage);
        
        return this.pages.get(kErrorPageUrl)!;
    }

    /**
     * Returns whether the page identified by |url| is known to the content provider. Requires the
     * content provider to have been successfully initialized.
     * 
     * @param url The URL to check existance for.
     */
    hasPage(url: string): boolean {
        if (!this.initialized)
            throw new Error(kExceptionMessage);

        return this.pages.has(url);
    }

    /**
     * Returns the last update time for the content that's being provided. Requires the content
     * provider to have been successfully initialized.
     * 
     * @TODO Return a moment() instance instead of the raw UNIX timestamp.
     */
    getLastUpdate(): number {
        if (!this.initialized)
            throw new Error(kExceptionMessage);
        
        return this.lastUpdate!;
    }
}
