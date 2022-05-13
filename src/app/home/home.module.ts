import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {HomeRoutingModule} from './home-routing.module';
import {HomeComponent} from './component/home/home.component';
import {NavigationModule} from "../navigation/navigation.module";
import {TranslateModule} from "@ngx-translate/core";


@NgModule({
  declarations: [
    HomeComponent
  ],
  imports: [
    CommonModule,
    HomeRoutingModule,
    NavigationModule,
    TranslateModule
  ]
})
export class HomeModule {
}
