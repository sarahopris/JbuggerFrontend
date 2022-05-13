import {Injectable} from '@angular/core';
import {BackendService} from "../../backend/backend.service";
import {Subject} from "rxjs";
import {HttpClient, HttpParams} from "@angular/common/http";
import {User} from "../../models/user";
import {UserDTO} from "../../models/userDTO";

@Injectable({
  providedIn: 'root'
})
export class UserService {
  bugAssignment$: Subject<[string, string]> = new Subject();

  constructor(private backendService: BackendService,
              private http: HttpClient) {
  }

  getUsersFromBD() {
    return this.backendService.get('http://localhost:4300/users/getAll');
  }

  assignBugToUser(bugName: string, userName: string) {
    this.bugAssignment$.next([bugName, userName]);
  }

  deactivateUser(username: string) {
    return this.backendService.put('http://localhost:4300/users/deactivateUserIfFiveTimesBadPassword', username);
  }

  checkPermissionManagement(username: string) {
    return this.backendService.get(`http://localhost:4300/users/checkPermissionManagement?username=${username}`)
  }

  checkUserManagementPermission() {
    return this.backendService.get(`http://localhost:4300/users/checkUserManagement?username=${localStorage.getItem('currentUsername')}`);
  }

  checkBugManagementPermission() {
    return this.backendService.get(`http://localhost:4300/users/checkBugManagement?username=${localStorage.getItem('currentUsername')}`);
  }

  checkBugClosePermission() {
    return this.backendService.get(`http://localhost:4300/users/checkBugClose?username=${localStorage.getItem('currentUsername')}`);
  }

  checkBugExportPdfPermission() {
    return this.backendService.get(`http://localhost:4300/users/checkBugExportPDF?username=${localStorage.getItem('currentUsername')}`);
  }

  addUserWithRoles(user: User, roles: String[]) {
    return this.backendService.post(`http://localhost:4300/users/addUserWithRoles?roles=${roles}`, user);
  }

  updateUserWithRoles(user: User, roles: any[], loggedUsername: string) {
    return this.backendService.post(`http://localhost:4300/users/updateUserWithRoles?roles=${roles}&loggedUsername=${loggedUsername}`, user, loggedUsername);
  }

  checkIfBugAssigned(username: string) {
    return this.backendService.get(`http://localhost:4300/users/checkIfBugAssignedIsEmpty`, {username: username});
  }

  activateDeactivateUser(userToActivate) {
    const params = new HttpParams()
      .set('userToModify', userToActivate);
    return this.http.get<boolean>("http://localhost:4300/users/activateDeactivate?" + params.toString());
  }

  setNotificationToRead(username: string) {
    return this.backendService.get(`http://localhost:4300/users/setNotificationToRead?username=${username}`);
  }

  getNotificationDTOsFromUser(username: string) {
    return this.backendService.get(`http://localhost:4300/users/getNotificationDTOsFromUser?username=${username}`);
  }

  getNumberOfUnredNotification(username: string) {
    return this.backendService.get(`http://localhost:4300/users/numberUnreadNotificationFromUser?username=${username}`);
  }

  editAccount(userDTO: UserDTO, currentPass:string, newPass: string) {
    let body = {
      username: userDTO.username,
      firstName: userDTO.firstName,
      lastName: userDTO.lastName,
      mobileNumber: userDTO.mobileNumber
    }
    return this.backendService.put(`http://localhost:4300/users/editAccount?currentPassword=${currentPass}&newPassword=${newPass}`, body);
  }

  checkIfPasswordSameAsUsername(username: string) {
    return this.backendService.get(`http://localhost:4300/users/userNameSameAsPassword?username=${username}`);
  }

  deleteOldNotifications() {
    return this.backendService.get(`http://localhost:4300/users/deleteOldNotifications`);
  }

  getInformationsAboutUser(username: string) {
    return this.backendService.get(`http://localhost:4300/users/getInformationsAboutUser?username=${username}`);
  }

}
