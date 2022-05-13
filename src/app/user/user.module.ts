import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {UserComponent} from "./components/user/user.component";
import {UserListComponent} from "./components/user-list/user-list.component";
import {RoleManagementModule} from "../role-management/role-management.module";
import {UserRoutingModule} from "./user-routing.module";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {UserProfileComponent} from './components/user-profile/user-profile.component';
import {UserRegistrationComponent} from './components/user-registration/user-registration.component';
import {DropdownModule} from "primeng/dropdown";
import {NavigationModule} from "../navigation/navigation.module";
import {TableModule} from "primeng/table";
import {InputNumberModule} from "primeng/inputnumber";
import {RadioButtonModule} from "primeng/radiobutton";
import {ToolbarModule} from "primeng/toolbar";
import {ButtonModule} from "primeng/button";
import {RippleModule} from "primeng/ripple";
import {ConfirmDialogModule} from "primeng/confirmdialog";
import {CheckboxModule} from "primeng/checkbox";
import {TooltipModule} from "primeng/tooltip";
import {DialogModule} from "primeng/dialog";
import {InputTextModule} from "primeng/inputtext";
import {InputTextareaModule} from "primeng/inputtextarea";
import {FileUploadModule} from "primeng/fileupload";
import {ConfirmationService, MessageService} from "primeng/api";
import {InputSwitchModule} from "primeng/inputswitch";
import {PermissionManagementModule} from "../permission-management/permission-management.module";
import {NotificationModule} from "../notification/notification.module";
import {ToastModule} from "primeng/toast";


@NgModule({
  declarations: [
    UserComponent,
    UserListComponent,
    UserProfileComponent,
    UserProfileComponent,
    UserRegistrationComponent
  ],

  imports: [
    CommonModule,
    RoleManagementModule,
    UserRoutingModule,
    ReactiveFormsModule,
    DropdownModule,
    NavigationModule,
    TableModule,
    FormsModule,
    InputNumberModule,
    RadioButtonModule,
    ToolbarModule,
    ButtonModule,
    RippleModule,
    ConfirmDialogModule,
    CheckboxModule,
    TooltipModule,
    DialogModule,
    InputTextModule,
    InputTextareaModule,
    FileUploadModule,
    InputSwitchModule,
    PermissionManagementModule,
    NotificationModule,
    ToastModule
  ],
  exports: [
    UserListComponent
  ],
  providers: [MessageService, ConfirmationService]
})
export class UserModule {
}
