import { Component, ElementRef, ViewChild } from "@angular/core";
import { ReadiumService } from "./readium/readium.service";
import { rediumHtml } from "./readium/readium-html";
import { DEBUG_EVENT, UPDATE_ORIENTATION_EVENT, UPDATE_PAGES_EVENT } from "./readium/redium-html-scripts";

import { book } from "./readium/book";
import { BehaviorSubject, combineLatest, of } from "rxjs";
import { map, pluck, tap } from "rxjs/operators";
import { SwipeGestureEventData, TapGestureEventData } from "@nativescript/core";
import { LoadEventData, WebViewExt } from "@nota/nativescript-webview-ext";
import { ReadiumOrientation, ReadiumUserView } from "./readium/redium.model";

@Component({
  selector: "ns-reader",
  templateUrl: "./reader.component.html",
  styleUrls: ["./reader.component.scss"],
  providers: [ReadiumService],
})
export class ReaderComponent {
    @ViewChild('webview') webview: ElementRef<WebViewExt>;

  pagesSource: BehaviorSubject<number> = new BehaviorSubject(0);
  pages$ = this.pagesSource.asObservable();
  webviewOrientationSource: BehaviorSubject<ReadiumOrientation> = new BehaviorSubject({ isLandscape: null, isPortrait: null });
  isLandscape$ = this.webviewOrientationSource.asObservable().pipe(pluck('isLandscape'));
  isPortrait$ = this.webviewOrientationSource.asObservable().pipe(pluck('isPortrait'));
  userViewSource: BehaviorSubject<ReadiumUserView> = new BehaviorSubject(ReadiumUserView.PagedOn);
  userView$ = this.userViewSource.asObservable();

  src$ = combineLatest([this.userView$]).pipe(
    map(([userView]) => rediumHtml({ body: book, userView })),
    tap(src => setTimeout(() => this.webview.nativeElement.src = src))
  );

  onTap(event: TapGestureEventData): void {}

  onSwipe(event: SwipeGestureEventData): void {}

  onLoaded(event: LoadEventData): void {
      console.log('loaded')
    const webview = event.object;
    webview.on(UPDATE_PAGES_EVENT, (msg) => this.pagesSource.next(Number(JSON.parse(msg.data))));
    webview.on(UPDATE_ORIENTATION_EVENT, (msg) => this.webviewOrientationSource.next(JSON.parse(msg.data)));
    webview.on(DEBUG_EVENT, (msg) => console.log(DEBUG_EVENT, msg.data));
  }

  onButtonTap() {
    this.userViewSource.next(this.userViewSource.value  === ReadiumUserView.ScrollOn ? ReadiumUserView.PagedOn : ReadiumUserView.ScrollOn);
  }
}
