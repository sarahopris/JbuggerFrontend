import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RoleRoutingModule} from './role-routing.module';
import {ReactiveFormsModule} from "@angular/forms";
import {NavigationModule} from "../navigation/navigation.module";
import {DropdownModule} from "primeng/dropdown";
import {RoleComponent} from './components/role/role.component';
import {DragDropModule} from "@angular/cdk/drag-drop";
import {ToastModule} from "primeng/toast";
import {MessageService} from "primeng/api";


@NgModule({
  declarations: [
    RoleComponent
  ],
  imports: [
    CommonModule,
    RoleRoutingModule,
    ReactiveFormsModule,
    NavigationModule,
    DropdownModule,
    DragDropModule,
    ToastModule
  ],
  exports: [
    RoleComponent
  ],
  providers: [
    MessageService
  ]
})
export class RoleModule {
}
