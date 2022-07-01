import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import {
  LoadEventData,
  WebViewEventData,
  WebViewExt,
} from "@nota/nativescript-webview-ext";
import { of } from "rxjs";
import { map, tap, withLatestFrom } from "rxjs/operators";
import { Slider } from "@nativescript/core";

import { ReadiumService } from "./readium/readium.service";
import { readiumHtml } from "./readium/readium-html";
import {
  DEBUG_EVENT,
  UPDATE_ORIENTATION_EVENT,
  UPDATE_PAGE_OFFSETS_EVENT,
  UPDATE_DIMENSIONS_EVENT,
  UPDATE_PAGES_EVENT,
  NS_BRIDGE_READY,
} from "./readium/scripts/redium-html-scripts";
import { book } from "./readium/book";
import { ReadiumUserView } from "./readium/redium.model";
import {
  SWIPELEFT_EVENT,
  SWIPERIGHT_EVENT,
  TAP_EVENT,
} from "./readium/scripts/gestures";
import { ReaderService } from "./services/reader.service";
import { readFirst } from "../utils/rxjs";

@Component({
  selector: "ns-reader",
  templateUrl: "./reader.component.html",
  styleUrls: ["./reader.component.scss"],
  providers: [ReadiumService],
})
export class ReaderComponent implements OnInit {
  @ViewChild("webview") webview: ElementRef<WebViewExt>;

  src$ = of(book).pipe(
    withLatestFrom(this.readerService.userView$),
    map(([book, userView]) => readiumHtml({ body: book, userView })),
    tap((src) => setTimeout(() => (this.webview.nativeElement.src = src)))
  );

  constructor(public readonly readerService: ReaderService) {}

  ngOnInit(): void {}

  onLoaded(event: LoadEventData): void {
    this.readerService.webviewLoadedSource.next(true);
    const webview = event.object;
    webview.on(DEBUG_EVENT, e => this.handleDebugEvent(e));
    webview.on(NS_BRIDGE_READY, _ => this.onNSBridgreReady());
    webview.on(UPDATE_PAGES_EVENT, e => this.handleUpdatePagesEvent(e));
    webview.on(UPDATE_ORIENTATION_EVENT, e => this.handleUpdateOrientationEvent(e));
    webview.on(UPDATE_PAGE_OFFSETS_EVENT, e => this.handleUpdatePageOffsetsEvent(e));
    webview.on(UPDATE_DIMENSIONS_EVENT, e => this.handleUpdateDimensionsEvent(e));
    webview.on(SWIPELEFT_EVENT, e => this.handleSwipeLeftEvent(e));
    webview.on(SWIPERIGHT_EVENT, e => this.handleSwipeRightEvent(e));
    webview.on(TAP_EVENT, e => this.handleTapEvent(e));
  }

  onNSBridgreReady(): void {}

  async onChangeUserView(): Promise<void> {
    const userView =
      this.readerService.userViewSource.value === ReadiumUserView.ScrollOn
        ? ReadiumUserView.PagedOn
        : ReadiumUserView.ScrollOn;
    await this.webview.nativeElement.executeJavaScript(`window.updateUserView('${userView}');`);
    this.readerService.userViewSource.next(userView);
  }

  onSliderValueChange(args: any): void {
    const slider = <Slider>args.object;
    // this.readerService.activePageSource.next(slider.value);
  }

  private handleDebugEvent({ data }: WebViewEventData): void {
    console.log(DEBUG_EVENT, data);
  }

  private handleUpdatePagesEvent({ data }: WebViewEventData): void {
    console.log(UPDATE_PAGES_EVENT, data);
    this.readerService.pagesSource.next(Number(JSON.parse(data)));
  }

  private handleUpdateOrientationEvent({ data }: WebViewEventData): void {
    console.log(UPDATE_ORIENTATION_EVENT, data);
    this.readerService.webviewOrientationSource.next(JSON.parse(data));
  }

  private handleUpdatePageOffsetsEvent({ data }: WebViewEventData): void {
    console.log(UPDATE_PAGE_OFFSETS_EVENT, data);
    this.readerService.pageOffsetsSource.next(JSON.parse(data));
  }

  private handleUpdateDimensionsEvent({ data }: WebViewEventData): void {
    console.log(UPDATE_DIMENSIONS_EVENT, data);
    this.readerService.dimensionsSource.next(JSON.parse(data));
  }

  private async handleSwipeLeftEvent({ data }: WebViewEventData): Promise<void> {
    console.log(SWIPELEFT_EVENT, data);
    const userView = await readFirst(this.readerService.userView$);
    const activePage = await readFirst(this.readerService.activePage$);
    const dimensions = await readFirst(this.readerService.dimensions$);
    if (ReadiumUserView.PagedOn === userView) {
      const left = activePage * dimensions.innerWidth;
      console.log({activePage, left})
      await this.webview.nativeElement.executeJavaScript(`window.scrollTo({left: ${left}})`);
      this.readerService.activePageSource.next(activePage + 1);
    }
  }

  private async handleSwipeRightEvent({ data }: WebViewEventData): Promise<void> {
    console.log(SWIPERIGHT_EVENT, data);
  }

  private handleTapEvent({ data }: WebViewEventData): void {
    console.log(TAP_EVENT, data);
  }
}
