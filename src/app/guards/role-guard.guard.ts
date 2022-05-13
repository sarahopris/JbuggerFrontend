import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import {Observable} from 'rxjs';
import {RoleService} from "../role/service/role-service/role.service";
import {UserService} from "../user/services/user.service";


@Injectable({
  providedIn: 'root'
})
export class RoleGuardGuard implements CanActivate {

  constructor(private userService: UserService) {
  }

  username: string;
  activation: Observable<any>;

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    this.username = localStorage.getItem('currentUsername');
    console.log(this.username);

    this.checkPermission(this.username);
    console.log(this.activation);
    return this.activation;
  }

  checkPermission(username: string) {
    this.userService.checkPermissionManagement(username).pipe((data) => this.activation = data);
  }
}
