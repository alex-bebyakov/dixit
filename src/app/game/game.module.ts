import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {GameComponent} from "./game.component";
import {gameRouting} from "./game.routing";
import {RootModule} from "./root/root.module";
import {AuthenticationService} from "../services/authentication.service";
import {AuthGuard} from "../services/auth.guard.service";

@NgModule({
  imports: [
    gameRouting,
    CommonModule, RootModule
  ],
  declarations: [
    GameComponent
  ],
  exports: [CommonModule],

  providers: [
    AuthGuard,
    AuthenticationService,

  ]
})
export class GameModule {
}
