import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {UserModule} from "./user/user.module";
import {BugModule} from "./bug/bug.module";
import {BackendModule} from "./backend/backend.module";
import {NavigationModule} from "./navigation/navigation.module";
import {ErrorComponent} from './error/error.component';
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {AuthentificationModule} from "./authentification/authentification.module";
import {RoleModule} from "./role/role.module";
import {HttpClient, HttpClientModule} from "@angular/common/http";
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import {BrowserNotSupportedModule} from "./browser-not-supported/browser-not-supported.module";
import {ToastModule} from "primeng/toast";

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  declarations: [
    AppComponent,
    ErrorComponent

  ],
  imports: [
    AppRoutingModule,
    BrowserModule,
    UserModule,
    BugModule,
    BackendModule,
    NavigationModule,
    BrowserAnimationsModule,
    AuthentificationModule,
    RoleModule,
    BrowserNotSupportedModule,
    HttpClientModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (HttpLoaderFactory),
        deps: [HttpClient]
      }
    }),
    ToastModule
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
