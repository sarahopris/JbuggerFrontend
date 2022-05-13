import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {UserService} from "../../../user/services/user.service";
import {MessageService} from "primeng/api";
import {User} from "../../../models/user";
import {UserDTO} from "../../../models/userDTO";

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss'],
})
export class ChangePasswordComponent implements OnInit {
  passwordForm: FormGroup;

  @Input()
  changePasswordDialog: boolean;
  user: User;
  phonePrefix = ["+40", "+49"];
  changePassword: boolean = false;

  constructor(private fb: FormBuilder,
              private userService: UserService,
              private messageService: MessageService,) {
  }

  /**
   * Initializes the component with a blank form; retrieves all the needed information abou
   */
  ngOnInit(): void {
    this.passwordForm = this.fb.group({
      firstName: new FormControl('', Validators.required),
      lastName: new FormControl(''),
      prefix: new FormControl('+40'),
      mobileNumber: new FormControl(''),
      current_pass: new FormControl(''),
      new_pass: new FormControl(''),
      confirm_new_pass: new FormControl(''),
    });

    this.userService.getInformationsAboutUser(localStorage.getItem('currentUsername')).subscribe((data) => {
      this.user = data;
    })
  }

  /**
   * Saves a new user into the database with handling possible errors.
   */
  saveUser() {

    let userDTO: UserDTO = {};
    userDTO.username = localStorage.getItem('currentUsername');
    userDTO.firstName = this.passwordForm.controls.firstName.value;
    userDTO.lastName = this.passwordForm.controls.lastName.value;
    userDTO.mobileNumber = this.passwordForm.controls.prefix.value + this.passwordForm.controls.mobileNumber.value;

    if (this.changePassword === false) {
      console.log("Don't change password")
      this.userService.editAccount(userDTO, '', '').subscribe();
      this.changePasswordDialog = false;
      this.changePassword = false;
      this.successfulEdit()
    } else {
      this.passwordForm.controls.current_pass.setValidators(Validators.required);
      this.passwordForm.controls.new_pass.setValidators(Validators.required);
      this.passwordForm.controls.confirm_new_pass.setValidators(Validators.required);


      if (this.passwordForm.controls.current_pass.value === '' || this.passwordForm.controls.new_pass.value === '' || this.passwordForm.controls.confirm_new_pass.value === '') {
       this.allFields();
      } else {
        if (this.passwordForm.controls.new_pass.value !== this.passwordForm.controls.confirm_new_pass.value) {
          // new_pass is not the same as confirm_new_pass
          this.samePasswords();
        } else {
          // change the password
          let currentPass = this.passwordForm.controls.current_pass.value;
          let newPass = this.passwordForm.controls.new_pass.value;

          if (this.passwordForm.controls.new_pass.value === this.passwordForm.controls.current_pass.value) {
           this.oldPassCantBeTheSameWithNew();
          } else {
            this.userService.editAccount(userDTO, currentPass, newPass).subscribe((data) => {
              if (data === false) {
                // the entered current_pass is not good
                this.currentPassNotCorrect();
              } else {
                this.successfulEdit();

                this.passwordForm.controls.current_pass.removeValidators(Validators.required);
                this.passwordForm.controls.new_pass.removeValidators(Validators.required);
                this.passwordForm.controls.confirm_new_pass.removeValidators(Validators.required);
                this.changePasswordDialog = false;
                this.changePassword = false;
                this.passwordForm.markAsUntouched();
                this.passwordForm.controls.current_pass.setValue('');
                this.passwordForm.controls.new_pass.setValue('');
                this.passwordForm.controls.confirm_new_pass.setValue('');
              }
            });
          }
        }
      }
    }
  }

  /**
   * Hides the dialog for changing password.
   */
  hideDialog() {
    this.changePasswordDialog = false;
    this.changePassword = false;
    this.passwordForm.markAsUntouched();
  }

  /**
   * Opens the dialog for changing password.
   */
  openDialog() {
    this.changePasswordDialog = true;
    this.passwordForm.controls.prefix.setValue(this.user.mobileNumber.substr(0, 3));
    this.passwordForm.controls.mobileNumber.setValue(this.user.mobileNumber.substr(3, 9));
  }

  /**
   * Shows the password changing div on profile edit dialog.
   */
  openPass() {
    this.changePassword = true;
  }


  samePasswords() {
    if (localStorage.getItem('appLanguage') === 'ro') {
      this.messageService.add({
        severity: 'error',
        summary: 'Eroare',
        detail: 'Parola confirmată trebuie sa fie aceeasi cu noua parolă!'
      })
    } else {
      this.messageService.add({
        severity: 'error',
        summary: 'Error Message',
        detail: 'The confirmation of the password has to be the same as the new password!'
      });
    }
  }

  validData() {
    if (localStorage.getItem('appLanguage') === 'ro') {
      this.messageService.add({
        severity: 'error',
        summary: 'Eroare',
        detail: 'Te rog introdu date valide!'
      });
    } else {
      this.messageService.add({
        severity: 'error',
        summary: 'Error Message',
        detail: 'Please enter valid data!'
      });
    }
  }

  currentPassNotCorrect() {
    if (localStorage.getItem('appLanguage') === 'ro') {
      this.messageService.add({
        severity: 'error',
        summary: 'Eroare',
        detail: 'Parola curentă introdusă nu este corectă!'
      });
    } else {
      this.messageService.add({
        severity: 'error',
        summary: 'Error Message',
        detail: 'The entered current password is not correct!'
      });
    }
  }

  successfulEdit() {
    if (localStorage.getItem('appLanguage') === 'ro') {
      this.messageService.add({
        severity: 'success',
        summary: 'Succes',
        detail: 'Ai editat cu succes contul tău!'
      });
    } else {
      this.messageService.add({
        severity: 'success',
        summary: 'Succes',
        detail: 'You have successfully edited your account!'
      });
    }
  }

  oldPassCantBeTheSameWithNew(){
    if (localStorage.getItem('appLanguage') === 'ro'){
      this.messageService.add({
        severity: 'error',
        summary: 'Eroare',
        detail: 'Noua parolă nu poate fi aceeași cu vechea parolă!'
      });
    }
    else{
      this.messageService.add({
        severity: 'error',
        summary: 'Error Message',
        detail: 'The new password can not be the same as the current password!'
      });
    }
  }

  allFields(){
    if(localStorage.getItem('appLanguage') == 'ro'){
      this.messageService.add({
        severity: 'error',
        summary: 'Eroare',
        detail: 'Te rugăm sa completezi toate câmpurile!'
      })
    }
    else{
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Please fill all fields in!'
      })
    }
  }

  closePass() {
    this.changePassword = false;
  }
}
