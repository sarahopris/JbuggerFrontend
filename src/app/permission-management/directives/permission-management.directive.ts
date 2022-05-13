import {Directive, ElementRef, Input, OnInit} from '@angular/core';
import {UserService} from "../../user/services/user.service";

@Directive({
  selector: '[appPermissionManagement]'
})
export class PermissionManagementDirective {
  @Input()
  username: string;
  disabledButton: boolean = false;

  constructor(private el: ElementRef, private userService: UserService) {
  }

  ngOnInit(): void {
    this.checkIfNoTasks();
    if (this.disabledButton === true) {
      this.el.nativeElement.style.display = "none";
    }
  }

  /**
   * Checks if user has remaining assigned bugs.
   */
  checkIfNoTasks() {
    this.userService.checkIfBugAssigned(this.username).subscribe(data =>
        this.disabledButton = false,
      error => {
        if (error.status === 403) {
          this.el.nativeElement.style.display = "none";
        }
      });
  }
}

