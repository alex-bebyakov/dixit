import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {SplashComponent} from "./splash.component";
import {splashRouting} from "./splash.routing";
import {MenuComponent} from "./menu/menu.component";
import {LoginComponent} from "./login/login.component";
import {FormsModule} from "@angular/forms";

@NgModule({
  imports: [
    CommonModule, splashRouting, FormsModule
  ],
  declarations: [SplashComponent, MenuComponent, LoginComponent],
  exports: [CommonModule, FormsModule]
})
export class SplashModule {
}
