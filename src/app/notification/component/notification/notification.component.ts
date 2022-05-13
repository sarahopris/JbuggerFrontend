import {Component, HostListener, Input, OnInit} from '@angular/core';
import {UserService} from "../../../user/services/user.service";
import {interval} from "rxjs";
import {MessageService} from "primeng/api";
import {UserNotificationDTO} from "../../../models/user-notification-dto";
import {TranslateService} from "@ngx-translate/core";


@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss']
})
export class NotificationComponent implements OnInit {

  constructor(private userService: UserService,
              public translate: TranslateService,
              private messageService: MessageService) {
  }

  currentUser: string;
  isEnglish: boolean = false;
  details: boolean;


  notificationDTOs: Array<UserNotificationDTO> = [];


  @Input()
  showNotifications: boolean;
  @Input()
  numberNew: number;

  private wasInside = true;

  /**
   * Changes variable that stores when the user has clicked on the notification bell.
   */
  @HostListener('click')
  clickInside() {
    this.wasInside = true;
  }

  /**
   * Changes variable that stores when the user has clicked off the notification table.
   */
  @HostListener('document:click')
  clickout() {
    if (!this.wasInside) {
      // user clicked somewhere on the page, we have to close the notifications
      this.showNotifications = false;
    }
    this.wasInside = false;
  }

  oldNotifications: Array<UserNotificationDTO> = [];

  /**
   * Initializations, along with deleting notifications older than 30 days, and sets the language
   */
  ngOnInit(): void {
    this.currentUser = localStorage.getItem('currentUsername');
    this.getNotifications(this.currentUser);
    this.userService.deleteOldNotifications().subscribe();
    this.translate.use(localStorage.getItem('appLanguage'));
  }

  /**
   * Updates the notification list every 5 seconds.
   * @param currentUsername - username of currently logged in user
   */
  updateNotifications(currentUsername: string) {
    interval(5000).subscribe(() => {
      if (localStorage.getItem('currentToken')) {
       this.oldNotifications = this.notificationDTOs;

        this.userService.getNotificationDTOsFromUser(localStorage.getItem('currentUsername')).subscribe((data) => {
          this.notificationDTOs = data;

          let newNotifications: Array<UserNotificationDTO> = [];

          this.notificationDTOs.forEach(notificationDTO => {
            let contains = false;
            for (let i = 0; i < this.oldNotifications.length; i++) {
              if (this.notificationEqual(this.oldNotifications[i], notificationDTO)) {
                contains = true;
              }
            }
            if (contains === false) {
              newNotifications.push(notificationDTO);
            }
          })

          newNotifications.forEach((notification) => {
            this.messageService.add({
              severity: 'info',
              summary: 'Notification',
              detail: notification.type
            })
          })
        })
        this.getNumberOfUnreadNotification();
      }
    });
  }

  /**
   * Checks for the equality of two notifications of the same user.
   * @param un1 - first user notification
   * @param un2 - second user notification
   */
  notificationEqual(un1: UserNotificationDTO, un2: UserNotificationDTO) {
    return un1.date === un2.date;
  }

  /**
   * Helper function to toggle notifications view.
   */
  toggleNotifications() {
    if (this.showNotifications === false) {
      this.showNotifications = true;
    } else {
      this.showNotifications = false;
      this.numberNew = 0;
      this.setNotificationsToRead(this.currentUser);
    }
  }

  /**
   * Returns the number of unread notifications of the currently logged in user.
   */
  getNumberOfUnreadNotification() {
    return this.userService.getNumberOfUnredNotification(this.currentUser).subscribe((number) => {
      this.numberNew = number;
    })
  }

  /**
   * Returns the notifications of the given user.
   * @param currentUsername
   */
  getNotifications(currentUsername: string) {
    this.userService.getNotificationDTOsFromUser(localStorage.getItem('currentUsername')).subscribe((data) => {
      this.notificationDTOs = data;
      this.oldNotifications = this.notificationDTOs;

      this.updateNotifications(currentUsername);
      this.getNumberOfUnreadNotification();
    })
  }

  /**
   * Sets all the notifications of the given user to read.
   * @param currentUsername
   */
  setNotificationsToRead(currentUsername: string) {
    this.userService.setNotificationToRead(currentUsername).subscribe();
  }
}
