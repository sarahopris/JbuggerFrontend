import {Component, HostListener, OnInit} from '@angular/core';
import {Bug} from "../../../models/bug";
import {Router} from "@angular/router";
import {Location} from "@angular/common";
import {BugService} from "../../services/bug/bug.service";
import jsPDF from 'jspdf';
import {UserService} from "../../../user/services/user.service";



@Component({
  selector: 'app-bug',
  templateUrl: './bug.component.html',
  styleUrls: ['./bug.component.scss']
})
export class BugComponent implements OnInit {

  bug: Bug = {} as Bug;
  exportInCourse: boolean = false;
  hasExportPdfPermissionBool: boolean;


  constructor(private router: Router,
              private userService: UserService) {
  }

  /**
   * Checks for bug data in history of state data or on localstorage and sets the 'hasExportPdfPermissionBool' variable,
   * which stores whether the user has or does not have the required permission to export a bug as a PDF file.
   * If not bug data is found, it redirects the user to the bug-list page.
   */
  ngOnInit(): void {
    if (history.state.data !== undefined) {
      this.bug = history.state.data.res;
    } else if (JSON.parse(localStorage.getItem('bug')) !== null) {
      this.bug = JSON.parse(localStorage.getItem('bug'));
    } else {
      this.router.navigate(['bugs'], {state: {data: {res: 'Failed to load bug data.'}}});
    }
    this.checkExportPdfPermission();
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
   * Initializes and starts the PDF exporting process of the currently shown bug.
   */
  exportToPdf() {
    this.exportInCourse = true;
    setTimeout(() => this.convertBugToPDF(), 0);
  }

  /**
   * Builds up and proceeds to save the PDF version of the currently shown bug.
   */
  convertBugToPDF() {
    let div = document.getElementById(`bug-${this.bug.idBug}-details`);
    let pdf = new jsPDF('p', 'pt', 'a4');
    let img = new Image();
    img.src = 'http://localhost:4300/bugs/assets/0';
    pdf.addImage(img, 25, 30, 130, 40);
    img.src = 'http://localhost:4300/bugs/assets/1';

    pdf.addImage(img, 165, 30, 130, 40);
    pdf.setFontSize(10);

    pdf.text(new Date().toLocaleString("RO-ro"), 25, 820);
    pdf.textWithLink('msg-systems.ro', 500, 820, {url: 'https://www.msg-systems.ro/'})

    pdf.html(div, {
      callback: doc => {
        let startOffSet = 65;
        doc.setFontSize(10);
        this.bug.attachments.forEach(att => {
          startOffSet += 20;
          doc.textWithLink(att.attContent, 121, div.scrollHeight + startOffSet,
            {url: `http://localhost:4300/bugs/${this.bug.idBug}/attachments/${att.attContent}`});
        });
        doc.save(`${this.bug.title} details ` + new Date().toLocaleString("RO-ro") + '.pdf');
        this.exportInCourse = false;
      },
      x: 25,
      y: 90
    });
  }

  /**
   * Navigates to the edit page of the currently shown bug
   * @param bug - object containing all the needed info about the currently shown bug, needed to navigate
   * the user to the correct edit page.
   */
  navigateToEditBug(bug: Bug) {
    this.router.navigate(['bugs/edit'], {state: {data: {res: bug}}});
  }

  /**
   * Checks whether the user has the required permission for PDF exporting or not.
   */
  checkExportPdfPermission() {
    return this.userService.checkBugExportPdfPermission().subscribe(hasPermission => this.hasExportPdfPermissionBool = hasPermission);
  }
}
