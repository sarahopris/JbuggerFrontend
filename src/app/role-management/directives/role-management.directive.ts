import {Directive, ElementRef, Input, OnInit} from '@angular/core';

@Directive({
  selector: '[appRoleManagement]'
})
export class RoleManagementDirective implements OnInit {

  @Input()
  validRole: string;

  ngOnInit(): void {
  }

}
