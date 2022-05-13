import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import {Observable} from 'rxjs';
import {UserService} from "../user/services/user.service";

@Injectable({
  providedIn: 'root'
})
export class UserPermissionGuard implements CanActivate {
  constructor(private userService: UserService,
              private router: Router) {
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    this.userService.checkUserManagementPermission().subscribe(
      (data) => {
        if (data === true) {
          return true;
        } else {
          let userNavigationLink = document.getElementsByClassName('navigation-link-user') as HTMLCollectionOf<HTMLElement>;

          // userNavigationLink[0].style.transform = "translate(-50%, -100%) rotate(" + s * 6 + "deg)";
          // userNavigationLink[0].setAttribute("style", "cursor: not-allowed; pointer-events: none;opacity: 0.5;text-decoration: none;");
          // return false;
          return this.router.navigate(['error']);
        }
      }
    )
    return true;
  }

}
