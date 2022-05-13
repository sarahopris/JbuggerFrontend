import {Injectable} from '@angular/core';
import {BackendService} from "../../../backend/backend.service";

@Injectable({
  providedIn: 'root'
})
export class PermissionService {

  constructor(private backendService: BackendService) {
  }

  getPermissions() {
    return this.backendService.get("http://localhost:4300/permissions");
  }
}
