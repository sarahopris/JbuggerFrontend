import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {BrowserNotSupportedComponent} from './browser-not-supported/browser-not-supported.component';
import {BrowserNotSupportedRoutingModule} from "./browser-not-supported-routing.module";
import {TranslateModule} from "@ngx-translate/core";


@NgModule({
  declarations: [
    BrowserNotSupportedComponent
  ],
  imports: [
    CommonModule,
    BrowserNotSupportedRoutingModule,
    TranslateModule
  ]
})
export class BrowserNotSupportedModule {
}
