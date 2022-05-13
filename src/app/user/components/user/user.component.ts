import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {User} from "../../../models/user";
import {ConfirmationService, MessageService} from "primeng/api";

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {

  @Input()
  public user: User;


  @Output()
  public dataExporter: EventEmitter<User> = new EventEmitter();


  constructor() {
  }

  ngOnInit(): void {
  }


  alertUserData(user) {
    this.dataExporter.emit(user);
    alert(this.user.firstName + "  " + this.user.roles);
  }
}
