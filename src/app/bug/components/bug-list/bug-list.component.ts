import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {Bug} from "../../../models/bug";
import {UserService} from "../../../user/services/user.service";
import {HttpErrorResponse} from "@angular/common/http";
import {User} from "../../../models/user";
import {Router} from "@angular/router";
import {FilterService, MessageService} from "primeng/api";
import {BugService} from "../../services/bug/bug.service";
import {formatDate} from "@angular/common";
import {ExcelService} from "../../services/bug/excel.service";
import {Status} from "../../../enums/status";

@Component({
  selector: 'app-bug-list',
  templateUrl: './bug-list.component.html',
  styleUrls: ['./bug-list.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [MessageService]
})
export class BugListComponent implements OnInit {
  public originalBugList: Bug[];
  public bugList: Bug[];
  public bug: Bug;
  public usersList: User[];
  public severityList = [{name: 'LOW'}, {name: 'HIGH'}, {name: 'CRITICAL'}, {name: 'MEDIUM'}];
  public statusList = [
    {
      name: 'OPEN',
    }, {
      name: 'IN_PROGRESS',
    }, {
      name: 'FIXED',
    }, {
      name: 'CLOSED',
    }, {
      name: 'REJECTED',
    }, {
      name: 'INFO_NEEDED',
    }]


  dataFromNewBug: any;
  listFilter = '';
  hasCloseBugPermission: boolean;
  openDialog: boolean;
  data: any;
  chartOptions: any;

  constructor(private userService: UserService,
              private bugService: BugService,
              private router: Router,
              private filterService: FilterService,
              private messageService: MessageService,
              private excelService: ExcelService,) {
  }

  initializeChart() {
    this.bugService.getNumberStatuses().subscribe((list)=> {
      this.data = {
        labels: ['OPEN', 'REJECTED', 'IN_PROGRESS', 'INFO_NEEDED', 'FIXED', 'CLOSED'],
        datasets: [
          {
            data: list,
            backgroundColor: [
              "#4d84e2",
              "#b21e35",
              "#5a189a",
              "#ff6d00",
              "#007f5f",
              "#003566",
            ],
            hoverBackgroundColor: [
              "#4d84e2",
              "#b21e35",
              "#5a189a",
              "#ff6d00",
              "#007f5f",
              "#003566",
            ]
          }
        ]
      };

    });

  }

  /**
   * Initializing process.
   * If bug data from show or edit bug is in the localStorage, clears it.
   * Checks for return message and shows it if found, when the user gets navigated
   * to this page after creating or editing a bug.
   */
  ngOnInit(): void {
    this.initializeChart();
    this.getAllBugs();
    this.getAllUsers();
    localStorage.removeItem('bug');
    this.registerFilter();
    this.checkBugClosePermission();
    if (history.state.data !== undefined) {
      setTimeout(() => {
        this.dataFromNewBug = history.state.data;
        if (this.dataFromNewBug.res.includes('successfully')) {
          if (this.dataFromNewBug.res.includes('added')) {
            this.dataFromNewBug.res = this.dataFromNewBug.res.substring(this.dataFromNewBug.res.indexOf(' ') + 1);
          }
          this.messageService.add({severity: 'success', summary: 'Success Message', detail: this.dataFromNewBug.res});
        } else if (this.dataFromNewBug.res.includes('saved without attachment integrity')) {
          this.messageService.add({severity: 'warn', summary: 'Warning Message', detail: this.dataFromNewBug.res});
        } else {
          this.messageService.add({severity: 'error', summary: 'Error Message', detail: this.dataFromNewBug.res});
        }
      }, 500);
    }
  }

  /**
   * Registers the date filter to the filterService.
   * @private
   */
  private registerFilter() {
    this.filterService.register('dateFilter', (value, filter) => {
      if (filter === undefined || filter === null) {
        return true;
      }
      if (value === undefined || value === null) {
        return false;
      }
      return formatDate(value, 'shortDate', 'en-US') === formatDate(filter, 'shortDate', 'en-US');
    })
  }

  /**
   * Gets all bug from the server database via backend webservice.
   * @private
   */
  private getAllBugs() {
    this.bugService.getAllBugsFromDB().subscribe((data) => {
      this.originalBugList = data;
      this.bugList = data;
    }, (error) => {
      if (localStorage.getItem('appLanguage') === 'ro') {
        console.error('Eroare HTTP', error.message, 'Codul statusului:', (<HttpErrorResponse>error).status);
        alert("Nu s-au putut accesa datele din baza de date!")
      } else {
        console.error('There was an HTTP error.', error.message, 'Status code:', (<HttpErrorResponse>error).status);
        alert("Couldn't get data from the database!")
      }
    });
  }

  /**
   * Gets all users from the server database via backend webservice.
   * @private
   */
  private getAllUsers() {
    this.userService.getUsersFromBD().subscribe(users =>
      this.usersList = users, error => {
      console.error('There was an HTTP error.', error.message, 'Status code:', (<HttpErrorResponse>error).status);
      alert("Couldn't get users from the database!")
    })
  }

  /**
   * Navigates user to the bug-info page of the corresponding bug.
   * @param bug
   */
  navigateToBug(bug: Bug) {
    this.router.navigate(['bugs/bugInfo'], {state: {data: {res: bug}}});
  }

  /**
   * Navigates user to the edit-bug page of the corresponding bug.
   * @param bug
   */
  navigateToEditBug(bug: Bug) {
    this.router.navigate(['bugs/edit'], {state: {data: {res: bug}}});
  }

  /**
   * this function is for closing bug if they are in FIXED status
   * @param bug - the bug we want to close
   */
  closeBug(bug: Bug) {
    if (bug.status.toString() === "CLOSED") {
      this.messageService.add({severity: 'error', summary: 'Error Message', detail: 'Already closed!'})
    } else if (["FIXED", 'REJECTED'].includes(bug.status.toString())) {
      this.bugService.closeBug(bug).subscribe(data => {
        this.messageService.add({severity: 'success', summary: 'Success Message', detail: data.body})
      }, error => {
        if (error.status == 404 || error.status == 400) {
          this.messageService.add({severity: 'error', summary: 'Error Message', detail: error.body})
        }
      });
      document.getElementById('bug-status-' + bug.idBug).innerText = 'CLOSED';
      bug.status = Status.CLOSED;
    } else {
      this.translateClosingErrorForBugs();
    }
  }

  /**
   * In case of an error of closing a bug, transfers it to the messageService (which will show the message)
   * in the currently set language of the application.
   */
  translateClosingErrorForBugs() {
    if (localStorage.getItem('appLanguage') === 'ro') {
      this.messageService.add({
        severity: 'error',
        summary: 'Mesaj de eroare',
        detail: 'Bug-ul nu poate fi inchis. Mai intai trebuie fixat!'
      });
    } else {
      this.messageService.add({
        severity: 'error',
        summary: 'Error Message',
        detail: 'Can\'t close bug. First need to fix it!'
      });
    }
  }

  /**
   * Checks if the currently logged in user has permission to close a bug.
   */
  checkBugClosePermission() {
    return this.userService.checkBugClosePermission().subscribe(hasPermission => this.hasCloseBugPermission = hasPermission);
  }

  /**
   * Opens the new bug page.
   */
  openNewBugPage() {
    location.href = 'http://localhost:4200/bugs/new';
  }

  /**
   * Exports the listed bugs to an Excel file in the currently set language of the application.
   */
  exportExcel() {
    try {
      if (localStorage.getItem('appLanguage') === 'ro') {
        this.excelService.downloadExcel(this.getHeaders(), this.getTableContent())
        this.messageService.add({
          severity: 'success', summary: 'Success', detail: 'Document descărcat!'
        })
      } else {
        this.excelService.downloadExcel(this.getHeaders(), this.getTableContent())
        this.messageService.add({
          severity: 'success', summary: 'Success Message', detail: 'Excel downloaded!'
        })
      }
    } catch (e) {
      this.messageService.add({severity: 'error', summary: 'Error Message', detail: e})
    }
  }

  /**
   * Fetches the header names of each column in the bug listing component.
   * Needed for exportExcel() function.
   * @private
   */
  private getHeaders() {
    let header: string[] = [];
    document.querySelectorAll("#bug_tabel th").forEach(e => {
      header.push(e.textContent)
    });
    header.pop();
    return header;
  }

  /**
   * Fetches all the data from the bug list.
   * Needed for exportExcel() function.
   * @private
   */
  private getTableContent() {
    let data: string[][] = [];
    let index = 0;
    const KEYS = ['title', 'description', 'createdByUsername', 'assignedToUsername', 'version', 'fixedVersion', 'severity', 'status', 'targetDate']
    this.bugList.forEach((value) => {
      data[index] = []
      for (let key of KEYS) {
        let temp = value[key];
        if (key === 'targetDate') {
          if (temp !== null) {
            temp = formatDate(temp, 'd.M.y', 'en-US');
          } else {
            if (localStorage.getItem('appLanguage') === 'en')
              temp = 'No target date'
            else
              temp = 'Nu este data specificata'
          }
        }
        if (key === 'fixedVersion') {
          if (temp === null) {
            if (localStorage.getItem('appLanguage') === 'en')
              temp = 'Not fixed'
            else
              temp = 'Nu este rezolvat'
          }
        }
        data[index].push(temp)
      }
      index++;
    })
    return data;
  }

  /**
   * Filters the bugs after title, corresponding the content of the search bar.
   */
  filterBugs() {
    this.bugList = this.originalBugList.filter((bug) => {
      if (bug.title.includes(this.listFilter)) {
        return bug;
      }
      return null;
    })
  }

  openChartDialog() {
    this.openDialog = true;
  }
}
