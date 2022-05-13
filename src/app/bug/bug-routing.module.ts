import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {BugListComponent} from "./components/bug-list/bug-list.component";
import {BugComponent} from "./components/bug/bug.component";
import {NewBugFormComponent} from "./components/new-bug-form/new-bug-form.component";
import {EditBugFormComponent} from "./components/edit-bug-form/edit-bug-form.component";

const routes: Routes = [
  {
    path: '',
    component: BugListComponent
  },
  {
    path: 'bugInfo',
    component: BugComponent
  },
  {
    path: 'new',
    component: NewBugFormComponent
  },
  {
    path: 'edit',
    component: EditBugFormComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BugRoutingModule {
}
