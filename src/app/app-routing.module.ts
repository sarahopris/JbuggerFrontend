import {NgModule} from '@angular/core';
import {ExtraOptions, RouterModule, Routes} from '@angular/router';
import {ErrorComponent} from "./error/error.component";
import {AuthorizationGuardGuard} from "./guards/authorization-guard.guard";
import {RoleGuardGuard} from "./guards/role-guard.guard";
import {LoginGuard} from "./guards/login.guard";
import {UserPermissionGuard} from "./guards/user-permission.guard";
import {BugGuard} from "./guards/bug.guard";
import {SupportedBrowserGuard} from "./guards/supported-browser.guard";

const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then(m => m.HomeModule),
    canActivate: [AuthorizationGuardGuard]
  },
  {
    path: 'users',
    loadChildren: () => import('./user/user.module').then(m => m.UserModule),
    canActivate: [AuthorizationGuardGuard, UserPermissionGuard]
  },
  {
    path: 'bugs',
    loadChildren: () => import('./bug/bug.module').then(m => m.BugModule),
    canActivate: [AuthorizationGuardGuard, BugGuard]
  },
  {
    path: 'login',
    loadChildren: () => import('./authentification/authentification.module').then(m => m.AuthentificationModule),
    canActivate: [LoginGuard]
  },
  {
    path: 'error',
    component: ErrorComponent
  },
  {
    path: 'roles',
    loadChildren: () => import('./role/role.module').then(m => m.RoleModule),
    canActivate: [RoleGuardGuard]
  },
  {
    path: 'not-supported',
    loadChildren: () => import('./browser-not-supported/browser-not-supported.module').then(m => m.BrowserNotSupportedModule)
  },
  {
    path: '**',
    redirectTo: 'home'
  }
];
const config: ExtraOptions = {
  enableTracing: false
}

@NgModule({
  imports: [RouterModule.forRoot(routes, config)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
