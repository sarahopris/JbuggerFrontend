import {Injectable} from '@angular/core';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from "@angular/common/http";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class TokenInterceptorService implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
     // if (req.url === 'http://localhost:4300/user/login' || req.url === 'http://localhost:4300/user/logout'){
      return next.handle(req);
     // }
     // else
     //   if (localStorage.getItem('currentToken')) {
     //   console.log("not login with token in localstorage")
     //   let tokenizedRequest = req.clone({
     //     setHeaders: {
     //       Authorization: localStorage.getItem('currentToken')
     //     },
     //   })
     //   return next.handle(tokenizedRequest);
     // }
     //   else {
     //   // the token expired
     //   console.log("token expired")
     //   localStorage.removeItem('currentToken');
     //   localStorage.removeItem('currentUser');
     //   localStorage.removeItem('currentUsername');
     //   this.router.navigate(['/home']);
     //   return null;
     // }
  }
}
