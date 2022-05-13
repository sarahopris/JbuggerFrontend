import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {User} from "../../../models/user";
import {UserService} from "../../services/user.service";
import {RoleService} from "../../../role/service/role-service/role.service";
import {MessageService} from "primeng/api";

@Component({
  selector: 'app-user-registration',
  templateUrl: './user-registration.component.html',
  styleUrls: ['./user-registration.component.scss']
})
export class UserRegistrationComponent implements OnInit {
  userForm: FormGroup;
  formSubmitted = false;
  phonePrefix = ["+40", "+49"];
  rolesOptions = ["ADM", "TM", "PM", "DEV", "TEST"];

  mapRoles = new Map([
    ["ADM", "Administrator"],
    ["DEV", "Developer"],
    ["TM", "Test Manager"],
    ["TEST", "Tester"],
    ["PM", "Project Manager"],
  ]);


  constructor(private fb: FormBuilder, private userService: UserService, private roleService: RoleService, private messageService: MessageService) {
  }

  ngOnInit(): void {
    this.userForm = this.fb.group({
      firstName: new FormControl('', Validators.required),
      lastName: new FormControl(''),
      prefix: new FormControl('+40'),
      mobileNumber: new FormControl(''),
      mail: new FormControl(''),
      password: new FormControl('')

    });
  }

  /**
   * Saves a new user to the database.
   */
  saveUser() {
    this.formSubmitted = true;
    console.log(this.userForm.controls.firstName.value);
    console.log(this.userForm.controls.lastName.value);
    console.log(this.userForm.controls.prefix.value + this.userForm.controls.mobileNumber.value);
    console.log(this.userForm.controls.mail.value);
    console.log(this.userForm.controls.password.value);
    console.log(this.rolesSelected);

    this.createUser();
    console.log(this.user);
    alert("New user created: " + this.user.firstName + " " + this.user.lastName);
    this.userService.addUserWithRoles(this.user, this.rolesSelected).subscribe();
  }

  user: User = {} as User;

  /**
   * Initializes the fields in the new user form.
   */
  createUser() {
    this.user.firstName = this.userForm.controls.firstName.value;
    this.user.lastName = this.userForm.controls.lastName.value;
    this.user.mobileNumber = this.userForm.controls.prefix.value + this.userForm.controls.mobileNumber.value;
    this.user.email = this.userForm.controls.mail.value;
    this.user.password = this.userForm.controls.password.value;
    this.user.status = 1;//active
    this.user.roles = [];
  }

  /**
   * Converts role string to role id (aka. index)
   * @param role - the string format of the role.
   */
  getIndexOf(role: string) {
    return this.rolesOptions.indexOf(role);
  }

  rolesSelected = [];

  /**
   * If the state of a checkbox has changed, this function will be activated.
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
}
