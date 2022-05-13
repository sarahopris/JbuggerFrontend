import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ChangePasswordComponent} from './components/change-password/change-password.component';
import {DialogModule} from "primeng/dialog";
import {ReactiveFormsModule} from "@angular/forms";
import {DropdownModule} from "primeng/dropdown";
import {PasswordModule} from "primeng/password";
import {TranslateModule} from "@ngx-translate/core";


@NgModule({
  declarations: [
    ChangePasswordComponent
  ],
  exports: [
    ChangePasswordComponent
  ],
  imports: [
    CommonModule,
    DialogModule,
    ReactiveFormsModule,
    DropdownModule,
    PasswordModule,
    TranslateModule
  ]
})
export class ChangePasswordModule {
}
