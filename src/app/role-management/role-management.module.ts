import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RoleManagementDirective } from './directives/role-management.directive';



@NgModule({
  declarations: [
    RoleManagementDirective
  ],
  imports: [
    CommonModule
  ],
  exports:[
    RoleManagementDirective
  ]
})
export class RoleManagementModule { }
