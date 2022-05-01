import { Component, ElementRef, ViewChild } from "@angular/core";
import { ReadiumService } from "./readium/readium.service";
import { rediumHtml } from "./readium/readium-html";
import { DEBUG_EVENT, UPDATE_PAGES_EVENT } from "./readium/redium-html-scripts";

import { book } from "./readium/book";
import { BehaviorSubject, of } from "rxjs";
import { SwipeGestureEventData, TapGestureEventData } from "@nativescript/core";
import { LoadEventData, WebViewExt } from "@nota/nativescript-webview-ext";

@Component({
  selector: "ns-reader",
  templateUrl: "./reader.component.html",
  styleUrls: ["./reader.component.scss"],
  providers: [ReadiumService],
})
export class ReaderComponent {
    @ViewChild(WebViewExt) webview: ElementRef<WebViewExt>;

  pagesSource: BehaviorSubject<number> = new BehaviorSubject(0);
  pages$ = this.pagesSource.asObservable();

  src$ = of(rediumHtml({ body: book }));

  onTap(event: TapGestureEventData): void {}

  onSwipe(event: SwipeGestureEventData): void {}

  onLoaded(event: LoadEventData): void {
      console.log('loaded')
    const webview = event.object;
    webview.on(UPDATE_PAGES_EVENT, (msg) => this.pagesSource.next(Number(JSON.parse(msg.data))));
    webview.on(DEBUG_EVENT, (msg) => console.log(DEBUG_EVENT, msg.data));
  }
}
