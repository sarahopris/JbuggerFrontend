import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {UserService} from "../../../user/services/user.service";
import {BugService} from "../../services/bug/bug.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-new-bug-form',
  templateUrl: './new-bug-form.component.html',
  styleUrls: ['./new-bug-form.component.scss'],
})
export class NewBugFormComponent implements OnInit {
  newBugForm: FormGroup
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
  res = '';
  buttonPushed = false;
  output: String[];
  filesToUpload: File[] = [];
  severityList = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'];
  severityModel = 'LOW';


  constructor(private fb: FormBuilder,
              private userService: UserService,
              private bugService: BugService,
              private router: Router) {
  }

  /**
   * Initializes the component with a blank form and retrieves all the usernames currently registered in the database.
   */
  ngOnInit(): void {
    this.getUsernamesFromDB();
    this.newBugForm = this.fb.group({
      title: new FormControl('', Validators.required),
      description: new FormControl('', [Validators.required, Validators.minLength(250)]),
      severity: new FormControl('LOW', Validators.required),
      version: new FormControl('', [Validators.required, Validators.pattern('^[a-zA-z0-9.]+$')]),
      targetDate: new FormControl(''),
      assignedToUsername: new FormControl(''),
      attachments: new FormControl(''),
      createdByUsername: new FormControl(`${localStorage.getItem('currentUsername')}`, Validators.required)
    });
  }

  /**
   * Saves the new bug in the database.
   */
  onSubmit() {
    this.buttonPushed = true;
    this.newBugForm.controls.attachments.setValue(null);
    this.newBugForm.controls.severity.setValue(this.severityModel);

    if (this.filesToUpload.length > 0) {
      const formDataForAtt = new FormData();
      this.filesToUpload.forEach(att => {
        formDataForAtt.append('files', att);
      });
      this.postNewBugDB(this.newBugForm.getRawValue(), formDataForAtt);
    } else {
      this.postNewBugDB(this.newBugForm.getRawValue());
    }
  }

  /**
   * Helper function for onSubmit(), proceeds to save the new bug in the database via backend webservice.
   * @param jsonObject - form data of the bug to be created
   * @param attachmentFormData - form data of the new bug
   */
  postNewBugDB(jsonObject, attachmentFormData?) {
    this.bugService.addBug(jsonObject).subscribe((response) => {
      this.res = response.message;

      if (this.res.includes("added successfully!") && typeof attachmentFormData !== 'undefined') {
        this.postAttToBugDB(attachmentFormData);
      } else {
        this.router.navigate(['bugs'], {state: {data: {res: this.res}}});
      }
    });
  }

  /**
   * Helper function for postNewBugDB(), to save the attachments of the new bug.
   * @param formData - FormData object, containing the attachments of the bug to be added.
   */
  postAttToBugDB(formData) {
    let bugId = +this.res.split(' ', 2)[0];
    this.bugService.addAttToBug(bugId, formData).subscribe(response => {
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
    this.output = this.usernamesDB.filter(item =>
      item.toLowerCase().includes(searchText.toLowerCase())
    );
  }

  /**
   * Checks whether all fields of the new bug form is valid or not.
   */
  isAllValid() {
    const assignedTo = this.newBugForm.controls.assignedToUsername.value;
    const createdBy = this.newBugForm.controls.createdByUsername.value;
    return this.newBugForm.valid &&
      this.allFilesValid &&
      (assignedTo === '' || assignedTo == null || this.usernamesDB.includes(assignedTo)) &&
      createdBy !== null &&
      this.usernamesDB.includes(createdBy);
  }

  /**
   * Fetches and stores all the currently registered users from the database.
   */
  getUsernamesFromDB() {
    this.userService.getUsersFromBD().subscribe((users) => {
      users.forEach(user => {
        this.usernamesDB.push(user.username);
      })
    })
  }

  /**
   * Validates the newly selected attachments, and adds the corresponding ones to the list of attachments to
   * be uploaded during the execution of onSubmit() function.
   * @param event
   */
  onFileChange(event) {
    this.filesToUpload = [];
    let size = 0;
    this.allFilesValid = true;  // presupunem ca totul e ok
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
}
