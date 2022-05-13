import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {BugComponent} from "./components/bug/bug.component";
import {BugListComponent} from "./components/bug-list/bug-list.component";
import {BugRoutingModule} from "./bug-routing.module";
import {NavigationModule} from "../navigation/navigation.module";
import {TableModule} from "primeng/table";
import {ButtonModule} from "primeng/button";
import {InputTextModule} from "primeng/inputtext";
import {DropdownModule} from "primeng/dropdown";
import {MultiSelectModule} from "primeng/multiselect";
import {FormsModule} from "@angular/forms";
import {CalendarModule} from "primeng/calendar";
import {TooltipModule} from "primeng/tooltip";
import {MessagesModule} from "primeng/messages";
import {FileUploadModule} from "primeng/fileupload";
import {ReactiveFormsModule} from "@angular/forms";
import {NewBugFormComponent} from "./components/new-bug-form/new-bug-form.component";
import {EditBugFormComponent} from './components/edit-bug-form/edit-bug-form.component';
import {AutoCompleteModule} from "primeng/autocomplete";
import {ToolbarModule} from "primeng/toolbar";
import {ToastModule} from "primeng/toast";
import {TranslateModule} from "@ngx-translate/core";
import {DialogModule} from "primeng/dialog";
import {ChartModule} from "primeng/chart";


@NgModule({
  declarations: [
    BugComponent,
    BugListComponent,
    NewBugFormComponent,
    EditBugFormComponent,
  ],
  imports: [
    CommonModule,
    BugRoutingModule,
    ReactiveFormsModule,
    DropdownModule,
    NavigationModule,
    AutoCompleteModule,
    TableModule,
    ButtonModule,
    InputTextModule,
    MultiSelectModule,
    FormsModule,
    CalendarModule,
    TooltipModule,
    MessagesModule,
    FileUploadModule,
    ToolbarModule,
    ToastModule,
    TranslateModule,
    DialogModule,
    ChartModule
  ],
  exports: [
    BugListComponent
  ]
})
export class BugModule {
}
