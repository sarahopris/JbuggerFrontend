import {Component, OnInit} from '@angular/core';
import {TranslateService} from "@ngx-translate/core";
import {Router} from "@angular/router";

@Component({
  selector: 'app-browser-not-supported',
  templateUrl: './browser-not-supported.component.html',
  styleUrls: ['./browser-not-supported.component.scss']
})
export class BrowserNotSupportedComponent implements OnInit {
  splitAgentStr: string[];

  constructor(public translate: TranslateService, private router: Router) {
  }

  /**
   * On initializing, sets the timeout for each element to appear on the page.
   * If somehow the user gets to this page from a supported browser, they automatically will be redirected
   * to the homepage.
   */
  ngOnInit(): void {
    if (this.checkIfChromeOrFF()) {
      this.router.navigate(['/home']);
    }
    setTimeout(() => {
      document.getElementById("hello").className = "fade-in";
      setTimeout(() => {
        document.getElementById("bad-news").className = "fade-in";
        setTimeout(() => {
          document.getElementById("alt-browsers").className = "fade-in";
          setTimeout(() => {
            document.getElementById("browsers").className = "fade-in";
          }, 2000);
        }, 2000);
      }, 2000);
    }, 1000);
  }

  /**
   * Function to change the language of the page
   * @param lang - code of the language (e.g.: 'en' or 'ro')
   */
  switchLang(lang: string) {
    localStorage.setItem('appLanguage', lang)
    this.translate.use(lang);
  }

  /**
   * Checks if the used browser is a new enough version of Chrome or Firefox.
   * Where 'new enough' means >35 for Chrome and >30 for Firefox versions.
   */
  checkIfChromeOrFF() {
    this.splitAgentStr = navigator.userAgent.split(' ');
    let len = this.splitAgentStr.length;
    return (this.splitAgentStr[len - 2].includes("Chrome") && this.splitAgentStr[len - 1].includes("Safari")
        && this.checkVer(len - 2))
      || (this.splitAgentStr[len - 1].includes("Chrome") && this.checkVer(len - 1))
      || (this.splitAgentStr[len - 1].includes("Firefox") && this.checkVer(len - 1));
  }

  /**
   * Checks if the version of the supported browser is new enough.
   * @param index - index from the split user agent, indexing the currently used browser.
   */
  checkVer(index): boolean {
    let browserInfo = this.splitAgentStr[index].split("/");
    return (browserInfo[0] === "Chrome" && browserInfo[1] > "35")
      || (browserInfo[0] === "Firefox" && browserInfo[1] > "30");
  }
}
