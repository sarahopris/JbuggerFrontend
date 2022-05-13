import {Component, ElementRef, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {User} from "../../../models/user";
import {UserService} from "../../services/user.service";
import {Router} from "@angular/router";
import {ConfirmationService, MessageService} from "primeng/api";
import {UserDTO} from "../../../models/userDTO";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {InputSwitch} from "primeng/inputswitch";


@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss'],
  styles: [`
    :host ::ng-deep .p-dialog .product-image {
      width: 150px;
      margin: 0 auto 2rem auto;
      display: block;
    }
  `]
})
export class UserListComponent implements OnInit {
  userAddDialog: boolean;
  phonePrefix = ["+40", "+49"];
  roleADM = "ADM";
  roleTM = "TM";
  rolePM = "PM";
  roleDEV = "DEV";
  roleTEST = "TEST";
  usersDB: User[];
  userDTO: UserDTO;
  submitted: boolean;
  userForm: FormGroup;
  rolesSelected = [];
  formSubmitted = false;
  user: User = {} as User;
  hasRoleDEV: boolean;
  hasRolePM: boolean;
  hasRoleTM: boolean;
  hasRoleADM: boolean;
  hasRoleTEST: boolean;
  msgs: any;

  constructor(private userService: UserService,
              private router: Router,
              private confirmationService: ConfirmationService,
              private fb: FormBuilder,
              private messageService: MessageService) {
  }

  ngOnInit(): void {
    this.getUsersDB();

    this.userForm = this.fb.group({
      firstName: new FormControl('', Validators.required),
      lastName: new FormControl(''),
      prefix: new FormControl('+40'),
      mobileNumber: new FormControl(''),
      mail: new FormControl(''),
      password: new FormControl(''),
      roles: new FormControl('')
    });
  }

  /**
   * Clears all the fields of the new user form.
   */
  clearAllFields() {
    this.userForm = this.fb.group({
      firstName: new FormControl('', Validators.required),
      lastName: new FormControl(''),
      prefix: new FormControl('+40'),
      mobileNumber: new FormControl(''),
      mail: new FormControl(''),
      password: new FormControl(''),
      roles: new FormControl('')
    });

    // clear the checkboxes
    this.hasRoleDEV = false;
    this.hasRolePM = false;
    this.hasRoleTM = false;
    this.hasRoleADM = false;
    this.hasRoleTEST = false;
  }

  /**
   * Fetches all the currently registeres users from the database.
   */
  getUsersDB() {
    this.userService.getUsersFromBD().subscribe((users) => {
      this.usersDB = users;
    })
  }

  toggleUserStatus(user: any) {
    // TODO if the user has unfinished tasks call the function popupDialogIfTheUserToDeactivateHasUnfinishedTasks
    // TODO if the user doesn't have unfinished tasks call the function confirmationDialogForDeactivateUser
  }

  popupDialogIfTheUserToDeactivateHasUnfinishedTasks(user: User) {
    this.confirmationService.confirm({
      message: 'The user has unfinished tasks. You can not deactivate ' + user.username + '!',
      header: 'Warning',
      icon: 'pi pi-exclamation-triangle',
    });
  }

  confirmationDialogForDeactivateUser(user: User) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to deactivate ' + user.username + '?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        // TODO deativate the user and make it more grey
        this.messageService.add({severity: 'success', summary: 'Successful', detail: 'Product Deleted', life: 3000});
      }
    });
  }

  /**
   * Opens the add new user popup form/dialog.
   */
  openAddDialog() {
    this.userDTO = {};
    this.submitted = false;
    this.userAddDialog = true;
    this.userForm.controls['password'].enable();

    this.rolesSelected = [];
    this.clearAllFields();
  }

  /**
   * Opens the edit user (aka. profile) popup form/dialog.
   * @param userDTO
   */
  openEditDialog(userDTO: UserDTO) {
    this.userDTO = {...userDTO};
    this.userAddDialog = true;
    this.userForm.controls['password'].disable();
    this.userForm.controls.prefix.setValue(this.userDTO.mobileNumber.substr(0, 3));
    this.userForm.controls.mobileNumber.setValue(this.userDTO.mobileNumber.substr(3, 9));
    this.rolesSelected = [];
    this.userDTO.roles.forEach(role => this.rolesSelected.push(role.type));
    this.checkTheRolesWhenEditUser();
    console.log(this.rolesSelected);
  }

  /**
   * Checks for the active roles of the currently logged in user.
   */
  checkTheRolesWhenEditUser() {
    this.hasRoleDEV = this.rolesSelected.includes("DEV");
    this.hasRolePM = this.rolesSelected.includes("PM");
    this.hasRoleTM = this.rolesSelected.includes("TM");
    this.hasRoleADM = this.rolesSelected.includes("ADM");
    this.hasRoleTEST = this.rolesSelected.includes("TEST");
  }

  /**
   * Saves the details of the new/edited user.
   */
  saveUser() {
    if (this.userForm.invalid === false) {
      if (this.userDTO.username) {
        this.editUser();
        this.userForm.markAsUntouched();
      } else {
        this.addUser();
        this.userForm.markAsUntouched();
      }
    } else {
      if (localStorage.getItem('appLanguage') === 'ro') {
        this.messageService.add({
          severity: 'error',
          summary: 'Eroare',
          detail: 'Va rugăm să introduceți date valide!'
        })
      } else {
        this.messageService.add({
          severity: 'error',
          summary: 'Error Message',
          detail: 'Please enter valid data!'
        })
      }
    }
  }

  /**
   * Saves the information of a newly added user in the database.
   */
  addUser() {
    this.submitted = true;
    this.formSubmitted = true;
    this.createUserForAdd();
    if (localStorage.getItem('appLanguage') === 'ro') {
      this.messageService.add({
        severity: 'success',
        summary: 'Succes',
        detail: 'Un nou utilizator a fost creat: ' + this.user.firstName + " " + this.user.lastName
      })
    } else {
      this.messageService.add({
        severity: 'success',
        summary: 'Success',
        detail: 'New user created: ' + this.user.firstName + " " + this.user.lastName
      })
    }

    this.userAddDialog = false;
    this.userService.addUserWithRoles(this.user, this.rolesSelected).subscribe(
      () => {
        this.getUsersDB();
      }
    );
  }

  /**
   * Saves the information of an edited user in the database.
   */
  editUser() {
    this.submitted = true;
    this.formSubmitted = true;
    this.createUserForEdit();
    if (localStorage.getItem('appLanguage') === 'ro') {
      this.messageService.add({
        severity: 'success',
        summary: 'Succes',
        detail: 'Datele utilizatorului ' + this.userDTO.username + ' au fost editate! '
      })
    } else {
      this.messageService.add({
        severity: 'success',
        summary: 'Success',
        detail: 'User ' + this.userDTO.username + ' edited! '
      });
    }

    this.userAddDialog = false;
    this.userService.updateUserWithRoles(this.user, this.rolesSelected, localStorage.getItem('currentUsername')).subscribe(
      () => {
        this.getUsersDB();
      }
    );
  }

  /**
   * Fills the form group with data introduced by the user (for creating a new user).
   */
  createUserForAdd() {
    this.user.firstName = this.userForm.controls.firstName.value;
    this.user.lastName = this.userForm.controls.lastName.value;
    this.user.mobileNumber = this.userForm.controls.prefix.value + this.userForm.controls.mobileNumber.value;
    this.user.email = this.userForm.controls.mail.value;
    this.user.password = this.userForm.controls.password.value;
    this.user.status = 1;//active
    this.user.roles = [];
  }

  /**
   * Fills the form group with data introduced by the user (for editing an already existing user).
   */
  createUserForEdit() {
    this.user.username = this.userDTO.username;
    this.user.firstName = this.userForm.controls.firstName.value;
    this.user.lastName = this.userForm.controls.lastName.value;
    this.user.mobileNumber = this.userForm.controls.prefix.value + this.userForm.controls.mobileNumber.value;
    this.user.email = this.userForm.controls.mail.value;
    this.user.password = this.userForm.controls.password.value;
    console.log(this.user);
  }

  /**
   * Modifies the list of selected roles for the added/edited user, according to the state of the checkboxes.
   * @param event
   */
  onCheckChange(event) {
    let val = event.target.value;
    if (event.target.checked) {
      this.rolesSelected.push(val);
    } else {
      for (let i = 0; i < this.rolesSelected.length; i++) {
        if (this.rolesSelected[i] === val) {
          this.rolesSelected.splice(i, 1);
        }
      }
    }
  }

  /**
   * Switches the activation state of a given user in the database.
   * @param userToModify
   */
  activateDeactivateUserDB(userToModify: string) {
    this.userService.activateDeactivateUser(userToModify).subscribe();
  }

  /**
   * Hides the popup dialog for adding/editing users.
   */
  hideDialog() {
    console.log(this.userDTO.username)
    this.userForm.markAsUntouched();
    this.userForm.markAsUntouched();
    this.userAddDialog = false;
    this.submitted = false;
  }
}
