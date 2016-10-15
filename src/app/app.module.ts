import {BrowserModule} from "@angular/platform-browser";
import {NgModule} from "@angular/core";
import {FormsModule} from "@angular/forms";
import {HttpModule, BaseRequestOptions} from "@angular/http";
import {MockBackend} from "@angular/http/testing";
import {NavbarModule} from "./modules/navbar/navbar.module";
import {SplashModule} from "./modules/splash/splash.module";
import {FooterModule} from "./modules/footer/footer.module";
import {GameModule} from "./modules/game/game.module";
import {AppComponent} from "./app.component";
import {routing} from "./app.routing";
import {fakeBackendProvider} from "./support/fake-backend";


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    NavbarModule,
    SplashModule,
    FooterModule,
    GameModule,
    routing
  ],
  providers: [
    fakeBackendProvider,
    MockBackend,
    BaseRequestOptions],
  bootstrap: [AppComponent]
})
export class AppModule {
}
