// Copyright 2019 Peter Beverloo. All rights reserved.
// Use of this source code is governed by the MIT license, a copy of which can
// be found in the LICENSE file.

import { IContentPage } from './IContentPage';

/**
 * @see https://github.com/AnimeNL/portal/blob/master/API.md#apicontent
 */
export interface IContent {
    lastUpdate: number;
    pages: IContentPage[];
}
