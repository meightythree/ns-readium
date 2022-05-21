import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { ReadiumService } from "./readium/readium.service";
import { readiumHtml } from "./readium/readium-html";
import { DEBUG_EVENT, UPDATE_ORIENTATION_EVENT, UPDATE_PAGE_OFFSETS_EVENT, UPDATE_DIMENSIONS_EVENT, UPDATE_PAGES_EVENT } from "./readium/scripts/redium-html-scripts";
import { book } from "./readium/book";
import { BehaviorSubject, combineLatest, Observable } from "rxjs";
import { first, map, pluck, tap } from "rxjs/operators";
import { SwipeGestureEventData, TapGestureEventData } from "@nativescript/core";
import { LoadEventData, WebViewExt } from "@nota/nativescript-webview-ext";
import { Dimensions, PageOffsets, ReadiumOrientation, ReadiumUserView } from "./readium/redium.model";
import { SWIPELEFT_EVENT, SWIPERIGHT_EVENT, TAP_EVENT } from "./readium/scripts/gestures";

const readFirst = <T>(obs$: Observable<T>): Promise<T> => obs$.pipe(first()).toPromise();

@Component({
  selector: "ns-reader",
  templateUrl: "./reader.component.html",
  styleUrls: ["./reader.component.scss"],
  providers: [ReadiumService],
})
export class ReaderComponent implements OnInit {
  @ViewChild('webview') webview: ElementRef<WebViewExt>;

  pagesSource: BehaviorSubject<number> = new BehaviorSubject(0);
  pages$ = this.pagesSource.asObservable();
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

  src$ = combineLatest([this.userView$])
    .pipe(
      map(([userView]) => readiumHtml({ body: book, userView })),
      tap(src => setTimeout(() => this.webview.nativeElement.src = src))
    );

  constructor() {}

  ngOnInit(): void {
    console.log("ngOnInit")
  }

  async onTap(event: TapGestureEventData): Promise<void> {
    const userView = await readFirst(this.userView$);
    if (ReadiumUserView.PagedOn === userView) {

    }
  }

  async onSwipe(event: SwipeGestureEventData): Promise<void> {
    const userView = await readFirst(this.userView$);
    if (ReadiumUserView.PagedOn === userView) {

    }
  }

  onLoaded(event: LoadEventData): void {
    this.webviewLoadedSource.next(true);
    const webview = event.object;
    webview.on(DEBUG_EVENT, (msg) => console.log(DEBUG_EVENT, msg.data));
    webview.on(UPDATE_PAGES_EVENT, (msg) => this.pagesSource.next(Number(JSON.parse(msg.data))));
    webview.on(UPDATE_ORIENTATION_EVENT, (msg) => this.webviewOrientationSource.next(JSON.parse(msg.data)));
    webview.on(UPDATE_PAGE_OFFSETS_EVENT, (msg) => this.pageOffsetsSource.next(JSON.parse(msg.data)));
    webview.on(UPDATE_DIMENSIONS_EVENT, (msg) => this.dimensionsSource.next(JSON.parse(msg.data)));
    webview.on(SWIPELEFT_EVENT, (msg) => console.log('SWIPELEFT_EVENT'));
    webview.on(SWIPERIGHT_EVENT, (msg) => console.log('SWIPERIGHT_EVENT'));
    webview.on(TAP_EVENT, (msg) =>  console.log('TAP_EVENT', msg.data));
  }

  onChangeUserView() {
    this.userViewSource.next(this.userViewSource.value  === ReadiumUserView.ScrollOn ? ReadiumUserView.PagedOn : ReadiumUserView.ScrollOn);
  }
}
