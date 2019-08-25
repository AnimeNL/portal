// Copyright 2019 Peter Beverloo. All rights reserved.
// Use of this source code is governed by the MIT license, a copy of which can
// be found in the LICENSE file.

import { Configuration } from '../base/Configuration';
import { IContent } from '../api/IContent';
import { IContentPage } from '../api/IContentPage';

import { validateArray, validateNumber, validateString } from '../base/TypeValidators';

/**
 * The content loader fetches the static content from the Content API. This content will not be
 * cached at the application layer, but can be cached by the Service Worker.
 * 
 * @see https://github.com/AnimeNL/portal/blob/master/API.md#apicontent
 */
export class ContentLoader {
    private configuration: Configuration;
    private content: IContent | null;

    constructor(configuration: Configuration) {
        this.configuration = configuration;
        this.content = null;
    }

    /**
     * Loads the content from the network. A boolean will be returned that indicates whether the
     * load was successful or not.
     */
    async initialize(): Promise<boolean> {
        const kErrorPrefix = 'Unable to fetch the environment data: ';

        try {
            const result = await fetch(this.configuration.getContentEndpoint());
            if (!result.ok) {
                console.error(kErrorPrefix + ` status ${result.status}`);
                return false;
            }

            const unverifiedContent = JSON.parse(await result.text());
            if (!this.validateContent(unverifiedContent))
                return false;
            
            this.content = unverifiedContent;
            return true;

        } catch (exception) {
            console.error(kErrorPrefix, exception);
        }
        return false;
    }

    /**
     * Validates the given |content| as data given in the IContent format. Error messages will be
     * sent to the console's error buffer if the data could not be verified.
     */
    validateContent(content: any): content is IContent {
        const kInterfaceName = 'IContent';

        if (!validateNumber(content, kInterfaceName, 'lastUpdate') ||
            !validateArray(content, kInterfaceName, 'pages')) {
            return false;
        }

        return (content['pages'] as any[]).every(page => this.validateContentPage(page));
    }

    /**
     * Validates the given |contentPage| as data in the IContentPage format. Error messages will be
     * sent to the console's error buffer if the data could not be verified.
     */
    validateContentPage(contentPage: any): contentPage is IContentPage {
        const kInterfaceName = 'IContentPage';

        return validateString(contentPage, kInterfaceName, 'url') &&
               validateString(contentPage, kInterfaceName, 'content');
    }

    /**
     * Returns the loaded content. Will throw an exception if the content had not been loaded
     * successfully.
     */
    getContent(): IContent {
        if (!this.content)
            throw new Error('The ContentLoader has not been successfully initialized yet.');

        return this.content;
    }
}
