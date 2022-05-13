import {Component, OnInit} from '@angular/core';
import {TranslateService} from "@ngx-translate/core";
import {UserService} from "./user/services/user.service";
import {MessageService} from "primeng/api";

/**
 * ROUTING:
 * localhost:4200 -> redirect to home
 * localhost:4200/home can be accessed only if the user is logged in, else the authorizationGuard will redirect the user to the login page
 * localhost:4200/user can be accessed only if the user is logged in, else the authorizationGuard will redirect the user to the login page
 * localhost:4200/bugs can be accessed only if the user is logged in, else the authorizationGuard will redirect the user to the login page
 */


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = '';
  exportedLastName: string;

  constructor(public translate: TranslateService,
              private userService: UserService,
              private messageService: MessageService) {
    translate.addLangs(['en', 'ro']);
    translate.setDefaultLang('en');
  }

  ngOnInit(): void {
    this.title = 'JBugger';

    // if (localStorage.getItem('currentToken')) {
    //   this.userService.checkIfPasswordSameAsUsername(localStorage.getItem('currentUsername')).subscribe((data) => {
    //     if (data === true) {
    //       console.log('message')
    //
    //         this.messageService.add({
    //           // sticky:true,
    //           severity: 'warn',
    //           summary: 'WARNING',
    //           detail: 'Please change your password!'
    //         })
    //
    //     }
    //   })
    // }
  }

  setExportedLastName(event: string) {
    this.exportedLastName = event;
  }
}
