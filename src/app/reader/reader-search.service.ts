import { Injectable } from "@angular/core";

import { book } from './readium/book'
import { readiumHtml } from './readium/readium-html'
import { ReadiumUserView } from "./readium/redium.model";

// import * as phantom from 'phantomjs-prebuilt';

@Injectable({
    providedIn: 'root'
})
export class ReaderSearchService {
    constructor() {}

    async search(): Promise<void> {
        // console.log(phantom);
    }
}