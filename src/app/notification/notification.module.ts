import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {NotificationComponent} from './component/notification/notification.component';
import {BadgeModule} from "primeng/badge";
import {TooltipModule} from "primeng/tooltip";
import {MessageService} from "primeng/api";
import {ToastModule} from "primeng/toast";
import {DialogModule} from "primeng/dialog";
import {TranslateModule} from "@ngx-translate/core";


@NgModule({
  declarations: [
    NotificationComponent
  ],
  exports: [
    NotificationComponent
  ],
  imports: [
    CommonModule,
    BadgeModule,
    TooltipModule,
    ToastModule,
    DialogModule,
    TranslateModule
  ],
  providers: [MessageService]
})
export class NotificationModule {
}
