import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import {
  LoadEventData,
  WebViewEventData,
  WebViewExt,
} from "@nota/nativescript-webview-ext";
import { combineLatest } from "rxjs";
import { map, tap } from "rxjs/operators";
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

@Component({
  selector: "ns-reader",
  templateUrl: "./reader.component.html",
  styleUrls: ["./reader.component.scss"],
  providers: [ReadiumService],
})
export class ReaderComponent implements OnInit {
  @ViewChild("webview") webview: ElementRef<WebViewExt>;

  src$ = combineLatest([this.readerService.userView$]).pipe(
    map(([userView]) => readiumHtml({ body: book, userView })),
    tap((src) => setTimeout(() => (this.webview.nativeElement.src = src)))
  );

  constructor(public readonly readerService: ReaderService) {}

  ngOnInit(): void {}

  onLoaded(event: LoadEventData): void {
    this.readerService.webviewLoadedSource.next(true);
    const webview = event.object;
    webview.on(DEBUG_EVENT, this.handleDebugEvent);
    webview.on(NS_BRIDGE_READY, this.onNSBridgreReady);
    webview.on(UPDATE_PAGES_EVENT, this.handleUpdatePagesEvent);
    webview.on(UPDATE_ORIENTATION_EVENT, this.handleUpdateOrientationEvent);
    webview.on(UPDATE_PAGE_OFFSETS_EVENT, this.handleUpdatePageOffsetsEvent);
    webview.on(UPDATE_DIMENSIONS_EVENT, this.handleUpdateDimensionsEvent);
    webview.on(SWIPELEFT_EVENT, this.handleSwipeLeftEvent);
    webview.on(SWIPERIGHT_EVENT, this.handleSwipeRightEvent);
    webview.on(TAP_EVENT, this.handleTapEvent);
  }

  onNSBridgreReady(): void {}

  onChangeUserView() {
    this.readerService.userViewSource.next(
      this.readerService.userViewSource.value === ReadiumUserView.ScrollOn
        ? ReadiumUserView.PagedOn
        : ReadiumUserView.ScrollOn
    );
  }

  onSliderValueChange(args: any): void {
    const slider = <Slider>args.object;
    this.readerService.activePageSource.next(slider.value);
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

  private handleSwipeLeftEvent({ data }: WebViewEventData): void {
    console.log(SWIPELEFT_EVENT, data);
  }

  private handleSwipeRightEvent({ data }: WebViewEventData): void {
    console.log(SWIPERIGHT_EVENT, data);
  }

  private handleTapEvent({ data }: WebViewEventData): void {
    console.log(TAP_EVENT, data);
  }
}
