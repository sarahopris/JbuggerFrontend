import {Component, OnInit} from '@angular/core';
import {Role} from "../../../models/role";
import {RoleService} from "../../service/role-service/role.service";
import {FormBuilder, FormControl, FormGroup} from "@angular/forms";
import {CdkDragDrop, moveItemInArray, transferArrayItem} from "@angular/cdk/drag-drop";
import {MessageService} from "primeng/api";


@Component({
  selector: 'app-role',
  templateUrl: './role.component.html',
  styleUrls: ['./role.component.scss']
})


export class RoleComponent implements OnInit {

  rolesTranslated: Array<Role> = [];

  constructor(private fb: FormBuilder, private roleService: RoleService, private messageService: MessageService) {
  }

  roleForm: FormGroup;
  rolesOptions: Array<string> = [];


  ngOnInit(): void {
    this.getRoles();

    this.roleForm = this.fb.group({
      role: new FormControl('')
    });
  }


  currPermissions: Array<string> = [];
  remainingPermissions: Array<string> = [];
  roles: Array<Role> = [];
  showEdit: boolean;

  mapRoles = new Map([
    ["ADM", "Administrator"],
    ["DEV", "Developer"],
    ["TM", "Test Manager"],
    ["TEST", "Tester"],
    ["PM", "Project Manager"],
  ]);


  /**
   * Changes visibility of role editing.
   */
  editRole() {
    this.showEdit = true;
  }

  /**
   * Fills up permission drag-and-drop fields.
   */
  getPermButton() {
    this.getPermList();
    this.getRemainingPermList()
  }

  /**
   * Fetches the selectable roles from the database.
   */
  getRoles() {
    this.roleService.getRoles().subscribe((role) => {
      this.roles = role;
      this.rolesOptions = [];
      for (let i of role) {
        this.rolesOptions.push(i.type);
      }
    });
  }

  selectedRole: string;

  /**
   * Fetches the selectable permissions from the database.
   */
  getPermList() {
    this.roleService.getPermList(this.roleForm.controls.role.value).subscribe((perms) => {
      this.currPermissions = perms;
    });
    // console.log(this.roleForm.controls.role.value);
    this.selectedRole = this.mapRoles.get(this.roleForm.controls.role.value);
  }

  /**
   * Fetches the selectable unselected permissions from the database.
   */
  getRemainingPermList() {
    this.roleService.getRemainingPermList(this.roleForm.controls.role.value).subscribe((perms) =>
      this.remainingPermissions = perms);
  }

  /**
   * Drag and drop helper function.
   * @param event
   */
  drop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex);
    }
  }

  /**
   * Saves the permission changes made to the role.
   */
  saveRoleChange() {
    this.roleService.updatePermList(this.roleForm.controls.role.value, this.currPermissions).subscribe();
    if (localStorage.getItem('appLanguage') === 'ro') {
      this.messageService.add({
        severity: 'success',
        summary: 'Succes',
        detail: 'Schimbările au fost aplicate rolului cu succes'
      })
    } else {
      this.messageService.add({
        severity: 'success',
        summary: 'Success',
        detail: 'The changes applied to the role have been saved'
      })
    }
  }
}
