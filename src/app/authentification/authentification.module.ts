import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {AuthentificationRoutingModule} from './authentification-routing.module';
import {LoginPageComponent} from "./components/login-page/login-page.component";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {NgxCaptchaModule} from 'ngx-captcha';
import {DialogModule} from "primeng/dialog";
import { TranslateModule} from "@ngx-translate/core";
import {SelectButtonModule} from 'primeng/selectbutton';

@NgModule({
  declarations: [
    LoginPageComponent
  ],
  imports: [
    CommonModule,
    AuthentificationRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    ReactiveFormsModule,
    NgxCaptchaModule,
    DialogModule,
    TranslateModule,
    SelectButtonModule
  ],
  exports: [
    LoginPageComponent
  ]
})
export class AuthentificationModule {
}



