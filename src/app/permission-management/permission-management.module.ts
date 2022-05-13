import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {PermissionManagementDirective} from './directives/permission-management.directive';


@NgModule({
  declarations: [
    PermissionManagementDirective
  ],
  exports: [
    PermissionManagementDirective
  ],
  imports: [
    CommonModule
  ]
})
export class PermissionManagementModule {
}
