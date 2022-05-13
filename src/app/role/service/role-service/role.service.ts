import {Injectable} from '@angular/core';
import {BackendService} from "../../../backend/backend.service";

@Injectable({
  providedIn: 'root'
})
/**
 * Backend service to create connection with role-related parts of the webserver.
 */
export class RoleService {

  constructor(private backendService: BackendService) {
  }

  getRoles() {
    return this.backendService.get("http://localhost:4300/roles");
  }

  getPermList(role: string) {
    return this.backendService.get(`http://localhost:4300/roles/getPermissions?roleType=${role}`);
  }

  getRemainingPermList(role: string) {
    return this.backendService.get(`http://localhost:4300/roles/getRemainingPermissions?roleType=${role}`);
  }

  updatePermList(role: string, permList: Array<string>) {
    console.log(permList);
    return this.backendService.post(`http://localhost:4300/roles/updatePermList?roleType=${role}`, permList);
  }

  findRoleByType(roleType: string) {
    return this.backendService.get(`http://localhost:4300/roles/findRoleByType?roleType=${roleType}`);
  }
}
