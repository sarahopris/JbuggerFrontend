import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {NavigationToolbarComponent} from './components/navigation-toolbar/navigation-toolbar.component';
import {RouterModule} from "@angular/router";
import {RoleManagementModule} from "../role-management/role-management.module";
import {BadgeModule} from "primeng/badge";
import {NotificationModule} from "../notification/notification.module";
import {ToastModule} from "primeng/toast";
import {TranslateModule} from "@ngx-translate/core";
import {SelectButtonModule} from "primeng/selectbutton";
import {FormsModule} from "@angular/forms";
import {TooltipModule} from "primeng/tooltip";
import {ChangePasswordModule} from "../change-password/change-password.module";


@NgModule({
  declarations: [
    NavigationToolbarComponent
  ],
  exports: [
    NavigationToolbarComponent,
    TranslateModule
  ],

  imports: [
    CommonModule,
    RouterModule,
    RoleManagementModule,
    BadgeModule,
    NotificationModule,
    ToastModule,
    SelectButtonModule,
    TranslateModule,
    FormsModule,
    TooltipModule,
    ChangePasswordModule

  ],
  providers: [
  ]
})
export class NavigationModule {
}

