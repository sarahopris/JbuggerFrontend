import {Injectable} from '@angular/core';
import {BackendService} from "../../../backend/backend.service";
import {Observable} from "rxjs";
import {Bug} from "../../../models/bug";

@Injectable({
  providedIn: 'root'
})
/**
 * Forwards data to the backendService, in order to reach the webserver.
 */
export class BugService {
  private url = 'http://localhost:4300/bugs/';

  constructor(private backendService: BackendService) {
  }

  getAllBugsFromDB(): Observable<Bug[]> {
    return this.backendService.get(this.url);
  }

  addBug(formData) {
    return this.backendService.post(this.url, formData, {
      headers: {"Content-Type": "application/json"},
      responseType: 'application/json'
    });
  }

  editBug(id, formData) {
    return this.backendService.put(`${this.url}${id}`, formData);
  }

  addAttToBug(id, formData) {
    return this.backendService.post(`${this.url}${id}/attachments`, formData, {
      headers: {"Content-Type": "mutipart/form-data", 'enctype': 'multipart/form-data'}
    });
  }

  deleteFileFromBugWithId(idBug, filename) {
    return this.backendService.delete(`${this.url}${idBug}/attachments/${filename}`);
  }

  closeBug(bug: Bug) {
    return this.backendService.put(`${this.url}updateStatus`, bug)
  }

  getNumberStatuses() {
    return this.backendService.get('http://localhost:4300/bugs/getListOfStatuses');
  }
}
