import {Component, OnInit} from '@angular/core';
import {TranslateService} from "@ngx-translate/core";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  currentUsername: string = localStorage.getItem('currentUsername');

  constructor(public translate: TranslateService) {
  }

  ngOnInit(): void {
    this.translate.use(localStorage.getItem('appLanguage'));
  }
}
