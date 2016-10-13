import {BrowserModule} from "@angular/platform-browser";
import {NgModule} from "@angular/core";
import {FormsModule} from "@angular/forms";
import {HttpModule, BaseRequestOptions} from "@angular/http";
import {MockBackend} from "@angular/http/testing";
import {NavbarModule} from "./navbar/navbar.module";
import {SplashModule} from "./splash/splash.module";
import {FooterModule} from "./footer/footer.module";
import {GameModule} from "./game/game.module";
import {AppComponent} from "./app.component";
import {routing} from "./app.routing";
import {fakeBackendProvider} from "./support/fake-backend";
import { DraggableDirective } from './directives/draggable.directive';


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
