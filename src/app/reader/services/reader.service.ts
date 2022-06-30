import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { pluck } from "rxjs/operators";

import { Dimensions, PageOffsets, ReadiumOrientation, ReadiumUserView, } from "../readium/redium.model";

@Injectable({
    providedIn: 'root'
})
export class ReaderService {
    pagesSource: BehaviorSubject<number> = new BehaviorSubject(0);
    pages$ = this.pagesSource.asObservable();
    activePageSource: BehaviorSubject<number> = new BehaviorSubject(0);
    activePage$ = this.pagesSource.asObservable();
    webviewOrientationSource: BehaviorSubject<ReadiumOrientation> = new BehaviorSubject({ isLandscape: null, isPortrait: null });
    isLandscape$ = this.webviewOrientationSource.asObservable().pipe(pluck('isLandscape'));
    isPortrait$ = this.webviewOrientationSource.asObservable().pipe(pluck('isPortrait'));
    userViewSource: BehaviorSubject<ReadiumUserView> = new BehaviorSubject(ReadiumUserView.PagedOn);
    userView$ = this.userViewSource.asObservable();
    pageOffsetsSource: BehaviorSubject<PageOffsets> = new BehaviorSubject({pageXOffset: 0, pageYOffset: 0});
    pageOffsets$ = this.pageOffsetsSource.asObservable();
    webviewLoadedSource = new BehaviorSubject(false);
    webviewLoaded$ = this.webviewLoadedSource.asObservable();
    dimensionsSource: BehaviorSubject<Dimensions> = new BehaviorSubject({clientHeight: null, clientWidth: null, innerHeight: null, innerWidth: null});
    dimensions$ = this.dimensionsSource.asObservable();

    constructor() {}
}