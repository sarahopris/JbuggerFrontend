import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {BrowserNotSupportedComponent} from "./browser-not-supported/browser-not-supported.component";

const routes: Routes = [
  {
    path: '',
    component: BrowserNotSupportedComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BrowserNotSupportedRoutingModule {
}
