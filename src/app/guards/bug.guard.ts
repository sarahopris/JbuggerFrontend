import {Injectable} from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree
} from '@angular/router';
import {Observable} from 'rxjs';
import {UserService} from "../user/services/user.service";

@Injectable({
  providedIn: 'root'
})
export class BugGuard implements CanActivate {
  username: string;

  constructor(private userService: UserService, private router: Router) {
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    return this.checkPermission().then(canAccess => {
      if (canAccess) {
        return true;
      } else {
        return this.router.navigate(['/home']);
      }
    });
  }

  checkPermission() {
    return this.userService.checkBugManagementPermission().toPromise();
  }
}
