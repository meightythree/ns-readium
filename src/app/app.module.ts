import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core'
import { NativeScriptModule } from '@nativescript/angular'

import { AppComponent } from './app.component'
import { ReaderComponent } from "./reader/reader.component";
import { WebViewExtModule } from "@nota/nativescript-webview-ext/angular"

@NgModule({
  bootstrap: [AppComponent],
  imports: [NativeScriptModule, WebViewExtModule],
  declarations: [AppComponent, ReaderComponent],
  providers: [],
  schemas: [NO_ERRORS_SCHEMA],
})
export class AppModule {}
