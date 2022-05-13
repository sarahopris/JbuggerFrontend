import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import {Observable} from 'rxjs';
import {LoginServiceService} from "../authentification/services/login-service.service";

@Injectable({
  providedIn: 'root'
})
export class AuthorizationGuardGuard implements CanActivate {
  constructor(private authenticationService: LoginServiceService,
              private router: Router) {
  }


  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    if (localStorage.getItem('currentToken')) {
      return true;
    } else {
      return this.router.navigate(['/login']);
    }
  }
}
