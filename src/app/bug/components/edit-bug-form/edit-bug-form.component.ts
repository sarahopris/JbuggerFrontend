import {Component, HostListener, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {UserService} from "../../../user/services/user.service";
import {BugService} from "../../services/bug/bug.service";
import {ActivatedRoute, Router} from "@angular/router";
import {Bug} from "../../../models/bug";
import {Status} from "../../../enums/status";

@Component({
  selector: 'app-edit-bug-form',
  templateUrl: './edit-bug-form.component.html',
  styleUrls: ['./edit-bug-form.component.scss']
})
export class EditBugFormComponent implements OnInit {
  bug: Bug = null;
  editBugForm: FormGroup
  formControlValue = '';
  usernamesDB: Array<string> = [];
  acceptedTypes: string[] = [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/vnd.oasis.opendocument.spreadsheet",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "application/vnd.ms-excel"
  ];
  allFilesValid = true;
  res: any = '';
  buttonPushed = false;
  output: String[];
  filesToUpload: File[] = [];
  filesToDelete: String[] = [];
  statusList: String[] = [];
  severityList = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'];

  constructor(private fb: FormBuilder,
              private userService: UserService,
              private bugService: BugService,
              private router: Router) {
  }

  /**
   * Initializes the component and its form, according to the received bug data.
   * In case of an error, it redirects the user to the bug-list page.
   */
  ngOnInit(): void {
    this.getUsernamesFromDB();

    if (history.state.data !== undefined || JSON.parse(localStorage.getItem('bug')) !== null) {
      this.bug = history.state.data !== undefined ? history.state.data.res : JSON.parse(localStorage.getItem('bug'));

      this.editBugForm = this.fb.group({
        title: new FormControl(this.bug.title, Validators.required),
        description: new FormControl(this.bug.description, [Validators.required, Validators.minLength(250)]),
        severity: new FormControl(this.bug.severity, Validators.required),
        version: new FormControl(this.bug.version, [Validators.required, Validators.pattern('^[a-zA-z0-9.]+$')]),
        fixedVersion: new FormControl(this.bug.fixedVersion, Validators.pattern('^[a-zA-z0-9.]*$')),
        assignedToUsername: new FormControl(),
        attachments: new FormControl(''),
        status: new FormControl(this.bug.status, Validators.required),
      });

      this.formControlValue = this.bug.assignedToUsername;
      this.setStatusList();
    } else {
      this.router.navigate(['bugs'], {state: {data: {res: 'Failed to load bug data.'}}});
    }
  }

  /**
   * Before unload, this function saves the bug data which will be stored in the localStorage, in case
   * that the user reloads the bug-info page.
   */
  @HostListener('window:beforeunload')
  saveBugBeforeUnload() {
    console.log(this.bug);
    localStorage.setItem('bug', JSON.stringify(this.bug));
  }

  /**
   * Submits the changes suffered by the loaded bug and proceeds to save the new version
   * in the database via the backend webservice.
   */
  onSubmit() {
    this.buttonPushed = true;
    this.editBugForm.controls.status.setValue(this.bug.status);
    this.editBugForm.controls.severity.setValue(this.bug.severity);
    this.editBugForm.controls.attachments.setValue(null);

    this.filesToDelete.forEach(filename => {
      this.bugService.deleteFileFromBugWithId(this.bug.idBug, filename).subscribe(response => {
        console.log(response);
      });
    })

    if (this.filesToUpload.length > 0) {
      const formDataForAtt = new FormData();
      this.filesToUpload.forEach(att => {
        formDataForAtt.append('files', att);
      });
      this.postEditedBugDB(this.editBugForm.getRawValue(), formDataForAtt);
    } else {
      this.postEditedBugDB(this.editBugForm.getRawValue());
    }
  }

  /**
   * Helper function for onSubmit(), to save the new bug data.
   * @param jsonObject - all info about the edited bug
   * @param attachmentFormData - optional: stores the attachments, in case of need for them
   */
  postEditedBugDB(jsonObject, attachmentFormData?) {
    this.bugService.editBug(this.bug.idBug, jsonObject).subscribe((response) => {
      this.res = response.message;

      if (this.res.includes("edited successfully!") && typeof attachmentFormData !== 'undefined') {
        this.postAttToBugDB(attachmentFormData);
      } else {
        this.router.navigate(['bugs'], {state: {data: {res: this.res}}});
      }
    });
  }

  /**
   * Helper function for postEditedBugDB(), to save the attachments of the edited bug.
   * @param formData - FormData object, containing the attachments
   */
  postAttToBugDB(formData) {
    this.bugService.addAttToBug(this.bug.idBug, formData).subscribe(response => {
      this.res = response.message;
      this.router.navigate(['bugs'], {state: {data: {res: this.res}}});
    });
  }

  /**
   * Used for autosuggestion. Searches after possible usernames according to the input of the
   * corresponding form element.
   * @param searchText
   */
  findChoices(searchText) {
    this.output = this.usernamesDB.filter(item => item.toLowerCase().includes(searchText.toLowerCase()));
  }

  /**
   * Checks whether all fields of the edit bug form is valid or not.
   */
  isAllValid() {
    const assignedTo = this.editBugForm.controls.assignedToUsername.value;
    return this.editBugForm.valid &&
      this.allFilesValid && (assignedTo === '' || assignedTo == null || this.usernamesDB.includes(assignedTo));
  }

  /**
   * Fetches and stores all the currently registered users from the database.
   */
  getUsernamesFromDB() {
    this.userService.getUsersFromBD().subscribe((users) => {
      users.forEach(user => {
        this.usernamesDB.push(user.username);
      });
    });
  }

  /**
   * In case of attachment deletion, adds the attachment name to the list of attachments to be deleted during
   * the execution of onSubmit() function.
   * @param attContent
   */
  deleteAttachment(attContent) {
    this.filesToDelete.push(attContent);
    let removeTarget = document.getElementById("attachment_" + attContent);
    removeTarget.className = "attachmentRowFadeOut";

    setTimeout(() => {
      removeTarget.parentNode.removeChild(removeTarget);
    }, 1000);
  }

  /**
   * Validates the newly selected attachments, and adds the corresponding ones to the list of attachments to
   * be uploaded during the execution of onSubmit() function.
   * @param event
   */
  onFileChange(event) {
    let size = 0;
    this.filesToUpload = [];
    this.allFilesValid = true;
    document.getElementById("file-upload-text-new-bug")
      .className = "file-upload-text-ok";
    document.getElementById("file-upload-size-text")
      .className = "file-upload-text-ok";
    for (let i = 0; i < event.target.files.length; i++) {
      if (!(this.acceptedTypes.includes(event.target.files[i].type) || event.target.files[i].type.startsWith("image"))) {
        document.getElementById("file-upload-text-new-bug")
          .className = "file-upload-text-not-ok";
        this.filesToUpload = [];
        this.allFilesValid = false;
      }
      size += event.target.files.item(i).size;
      if (size / 1024 / 1024 > 25) {
        document.getElementById("file-upload-size-text").className = "file-upload-text-not-ok";
        this.filesToUpload = [];
        this.allFilesValid = false;
      }
      this.filesToUpload.push(event.target.files.item(i));
    }
    return this.allFilesValid;
  }

  /**
   * Initializes the status dropdown with the corresponding elements, according to the current
   * status of the edited bug.
   */
  setStatusList() {
    console.log(this.bug.status.toString())
    switch (this.bug.status.toString()) {
      case 'OPEN':
      case '0':
        this.statusList = ['OPEN', 'IN_PROGRESS', 'REJECTED'];
        break;
      case 'IN_PROGRESS':
      case '1':
        this.statusList = ['IN_PROGRESS', 'FIXED', 'REJECTED', 'INFO_NEEDED'];
        break;
      case 'FIXED':
      case '2':
        this.statusList = ['FIXED', 'OPEN'];
        this.checkBugClosePermission().then(hasPermission => {
          if (hasPermission) {
            this.statusList.push('CLOSED');
          }
        });
        break;
      case 'INFO_NEEDED':
      case '5':
        this.statusList = ['INFO_NEEDED', 'IN_PROGRESS'];
        break;
      case 'REJECTED':
      case '4':
        this.statusList = ['REJECTED', 'CLOSED'];
        break;
      case 'CLOSED':
      case '3':
        this.statusList = ['CLOSED'];
        break;
    }
  }

  /**
   * Checks if the currently logged in user has permission to close a bug.
   */
  checkBugClosePermission() {
    return this.userService.checkBugClosePermission().toPromise();
  }
}
