import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SupportedBrowserGuard implements CanActivate {
  splitAgentStr: string[];

  constructor(private router: Router) {
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    if (this.checkIfChromeOrFF()) {
      return true;
    } else {
      return this.router.navigate(['/not-supported']);
    }
  }

  checkIfChromeOrFF() {
    this.splitAgentStr = navigator.userAgent.split(' ');
    let len = this.splitAgentStr.length;
    return (this.splitAgentStr[len - 2].includes("Chrome") && this.splitAgentStr[len - 1].includes("Safari")
        && this.checkVer(len - 2))
      || (this.splitAgentStr[len - 1].includes("Chrome") && this.checkVer(len - 1))
      || (this.splitAgentStr[len - 1].includes("Firefox") && this.checkVer(len - 1));
  }

  checkVer(index): boolean {
    let browserInfo = this.splitAgentStr[index].split("/");
    return (browserInfo[0] === "Chrome" && browserInfo[1] > "35")
      || (browserInfo[0] === "Firefox" && browserInfo[1] > "30");
  }
}
