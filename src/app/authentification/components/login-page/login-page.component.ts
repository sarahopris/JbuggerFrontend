import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {LoginServiceService} from "../../services/login-service.service";
import {first} from "rxjs/operators";
import {User} from "../../../models/user";
import {UserService} from "../../../user/services/user.service";
import {ConfirmationService, MessageService, SelectItem} from "primeng/api";
import {TranslateService} from "@ngx-translate/core";
import {TranslateCacheService} from "ngx-translate-cache";

export interface Lang{
  name: string,
  code: string
}

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss']
})
export class LoginPageComponent implements OnInit {
  loginForm: FormGroup;
  loading = false;
  submitted = false;

  // if one of the inputs is empty isFormInvalid will be true
  isFormInvalid = false;

  // if there is no user in the database with the given username and password
  areCredentialsInvalid = false;

  isCaptchaUnchecked = false;

  aFormGroup: FormGroup;
  siteKey: string = "6LdGiBwcAAAAADV-ewm3AvV1MfGYH8xt3ifPx0TD";

  numberOfBadPassword: number = 0;

  displayModal: boolean = false;
  displayModalAfterFourBadPassword: boolean = false;

  translatedLanguages : Lang[];
   selectedLang: Lang;

  constructor(private formBuilder: FormBuilder,
              private formBuilderCaptcha: FormBuilder,
              private route: ActivatedRoute,
              private router: Router,
              private userService: UserService,
              private authenticationService: LoginServiceService,
              public translate: TranslateService,
  ) {
    this.translatedLanguages = [
      {name: 'English', code: 'en'},
      {name: 'Română', code:'ro'}
    ];
  }

  /**
   * Changes the language of the application.
   * @param lang - Language object containing the name and the code for the preferred language
   */
  switchLang(lang: string) {
    localStorage.setItem('appLanguage',lang)
    this.translate.use(lang);
  }

  /**
   * Initializing login parameters.
   */
  ngOnInit() {
    localStorage.setItem('appLanguage','en');
    this.translate.use(localStorage.getItem('appLanguage'));
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });

    this.aFormGroup = this.formBuilderCaptcha.group({
      recaptcha: ['', Validators.required]
    });
  }

  get f() {
    return this.loginForm.controls;
  }

  /**
   * login the user
   * if the form is invalid activate with the isFormInvalid flag the div, which tells the user to fill all the inputs in
   * if there is an error that there isn't any user in the database with the given username and password (NOT FOUND returned by backend),
   * catch it and activate the areCredentialsInvalid flag
   * if user not found in database, redirect to home -> if there isn't another user logged in on the computer, home will redirect to login
   */
  onSubmit() {
    this.submitted = true;
    console.log(this.numberOfBadPassword);

    if (this.loginForm.invalid) {
      this.isFormInvalid = true;
      this.areCredentialsInvalid = false;
      this.isCaptchaUnchecked = false;
      return;
    }

    if (this.aFormGroup.invalid) {
      this.isCaptchaUnchecked = true;
      this.isFormInvalid = false;
      this.areCredentialsInvalid = false;
      return;
    }
    this.loading = true;

    try {
      this.authenticationService.login(this.f.username.value, this.f.password.value)
        .pipe(first())
        .subscribe(
          data => {
            if (data !== "User not found!") {
              this.router.navigate(['/home']);
            }
            // else if (data === "User not found") {
            //   this.isCaptchaUnchecked = false;
            //   this.isFormInvalid = false;
            //   this.areCredentialsInvalid = true;
            // }
            // else if (data ==="Bad password!") {
            //   this.numberOfBadPassword = this.numberOfBadPassword + 1;
            //   this.isCaptchaUnchecked = false;
            //   this.isFormInvalid = false;
            //   this.areCredentialsInvalid = true;
            // }
          },
          error => {
            console.log(error);
            if (error.status === 404) {
              this.isCaptchaUnchecked = false;
              this.isFormInvalid = false;
              this.areCredentialsInvalid = true;

            }
            if (error.status === 409) {
              this.numberOfBadPassword = this.numberOfBadPassword + 1;
              this.isCaptchaUnchecked = false;
              this.isFormInvalid = false;
              this.areCredentialsInvalid = true;
            }

            if (this.numberOfBadPassword === 4) {
              this.displayModalAfterFourBadPassword = true;
            }

            if (this.numberOfBadPassword === 5) {
              // deactivate the user
              this.userService.deactivateUser(this.f.username.value).subscribe();
              this.displayModal = true;
            }
            this.loading = false;
          });
    } catch(error) {}
  }
}
