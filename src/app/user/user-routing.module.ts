import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {UserListComponent} from "./components/user-list/user-list.component";
import {UserProfileComponent} from "./components/user-profile/user-profile.component";
import {UserRegistrationComponent} from "./components/user-registration/user-registration.component";

const routes: Routes = [
  {
    path: '',
    component: UserListComponent,
    children: [
      {
        path: 'userProfile',
        component: UserProfileComponent
      },
    ]
  },
  {
    path: 'register',
    component: UserRegistrationComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],//this is a child
  exports: [RouterModule]
})
export class UserRoutingModule {
}
