import {Component, OnInit} from '@angular/core';
import {LoginServiceService} from "../../../authentification/services/login-service.service";
import {Router} from "@angular/router";
import {UserService} from "../../../user/services/user.service";
import {TranslateService} from "@ngx-translate/core";
import {Lang} from "../../../authentification/components/login-page/login-page.component";
import {MessageService} from "primeng/api";


@Component({
  selector: 'app-navigation-toolbar',
  templateUrl: './navigation-toolbar.component.html',
  styleUrls: ['./navigation-toolbar.component.scss']
})
export class NavigationToolbarComponent implements OnInit {
  showNotifications: boolean = false;
  numberNew: number = 0;
  defaultLang: string = "en"
  openChangePasswordDialog: boolean;
  translatedLanguages: Lang[];
  selectedLang: Lang;

  constructor(private authenticationService: LoginServiceService,
              private router: Router,
              private userService: UserService, public translate: TranslateService,
              private messageService: MessageService) {
    translate.addLangs(['en', 'ro']);

    this.translatedLanguages = [
      {name: 'English', code: 'en'},
      {name: 'Română', code: 'ro'},
    ]
  }

  /**
   * Function to change the language of the page
   * @param lang - code of the language (e.g.: 'en' or 'ro')
   */
  switchLang(lang: string) {
    localStorage.setItem('appLanguage', lang);
    this.translate.use(lang);
  }

  /**
   * Initializing: sets the selected page in navbar, the active language in the language selector switch
   * and if the user did not change their default password yet, insists on suggesting them to change
   * it by an automatically appearing warning message.
   */
  ngOnInit(): void {
    this.translate.use(localStorage.getItem('appLanguage'));
    this.disableLinksInNavigationBarIfUserHasNoPermission();
    this.setActiveIfSelected("home");
    this.setActiveIfSelected("users");
    this.setActiveIfSelected("roles");
    this.selectedLang = localStorage.getItem('appLanguage') === 'en' ? this.translatedLanguages[0] : this.translatedLanguages[1];

    if (localStorage.getItem('currentToken')) {
      this.userService.checkIfPasswordSameAsUsername(localStorage.getItem('currentUsername')).subscribe((data) => {
        if (data === true) {
          if(localStorage.getItem('appLanguage') == 'ro') {
            this.messageService.add({
              sticky: true,
              severity: 'warn',
              summary: 'ATENȚIONARE',
              detail: 'Te rugăm să îți schimbi parola!'
            });
          }
        else{
            this.messageService.add({
              sticky: true,
              severity: 'warn',
              summary: 'WARNING',
              detail: 'Please change your password!'
            });
          }
        }
      })
    }
  }

  /**
   * logout the user and navigate to the login page
   */
  logout() {
    this.authenticationService.logout();
  }

  /**
   * Disables those links in the navbar, where the logged in user does not have the permission to go.
   */
  disableLinksInNavigationBarIfUserHasNoPermission() {
    this.userService.checkUserManagementPermission().subscribe(
      (data) => {
        if (data === false) {
          let userNavigationLink = document.getElementsByClassName('navigation-link-user') as HTMLCollectionOf<HTMLElement>;
          userNavigationLink[0].setAttribute("style", "display:none");
        }
      }
    );

    this.userService.checkBugManagementPermission().subscribe(
      (data) => {
        if (data === false) {
          let userNavigationLink = document.getElementsByClassName('navigation-link-bug') as HTMLCollectionOf<HTMLElement>;
          userNavigationLink[0].setAttribute("style", "display:none");
        }
      }
    );

    this.userService.checkPermissionManagement(localStorage.getItem('currentUsername')).subscribe(
      (data) => {
        if (data === false) {
          let userNavigationLink = document.getElementsByClassName('navigation-link-rolePermission') as HTMLCollectionOf<HTMLElement>;
          userNavigationLink[0].setAttribute("style", "display:none");
        }
      }
    )
  }

  /**
   * Sets the currently active menu point (aka. page we're on) from the navbar.
   * @param menuElem - the id of the active menu element
   */
  setActiveIfSelected(menuElem: string) {
    if (document.URL.includes(menuElem)) {
      document.getElementById(menuElem).classList.add('active');
      document.getElementById("bugs").classList.remove('active');
    }
  }

  /**
   * Opens the change password dialog.
   */
  openDialog() {
    this.openChangePasswordDialog = true;
  }
}
