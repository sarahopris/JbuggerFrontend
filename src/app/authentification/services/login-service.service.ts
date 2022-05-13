import {Injectable, OnInit} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {map} from "rxjs/operators";
import {BehaviorSubject, Observable} from "rxjs";
import {User} from "../../models/user";
import {BackendService} from "../../backend/backend.service";
import {Router} from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class LoginServiceService implements OnInit {

  private currentUserSubject: BehaviorSubject<User>;
  public currentUser: Observable<User>;

  constructor(private http: HttpClient, private backendService: BackendService,
              private router: Router) {
    this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser')));
    this.currentUser = this.currentUserSubject.asObservable();
  }


  /**
   * make the login request to generate a token in backend and save the logged in user in the localstorage
   * @param username the username given in the form
   * @param password the password given in the form
   */
  login(username, password) {
    const body = {
      username: username,
      password: password
    }


    return this.backendService.post('http://localhost:4300/user/login', body)
      .pipe(
        map(user => {
          localStorage.setItem('currentUser', JSON.stringify(user));
          localStorage.setItem('currentUsername', user.username);
          localStorage.setItem('currentToken', user.token);
          this.currentUserSubject.next(user);
          return user;
        })
      );
  }


  /**
   * make a http request to delete the token from the database
   * delete the informations about the user from the localstorage
   */
  logout() {
    return this.backendService.post('http://localhost:4300/user/logout', localStorage.getItem('currentUsername')).subscribe(() => {
      localStorage.removeItem('currentToken');
      localStorage.removeItem('currentUser');
      localStorage.removeItem('currentUsername');
      this.router.navigate(['/login']);
    });
  }

  ngOnInit(): void {
  }
}

