import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {GameComponent} from "./game.component";
import {gameRouting} from "./game.routing";
import {RootModule} from "./root/root.module";
import {AuthenticationService} from "../../services/authentication.service";
import {AuthGuard} from "../../services/guard.service";
import {MessageService} from "../../services/message.service";
import {SocketService} from "../../services/socket.service";
import {GameService} from "../../services/game.service";
import {CaruselService} from "../../services/carusel.service";



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
      AuthGuard, MessageService, AuthenticationService, SocketService, GameService, CaruselService
  ]
})
export class GameModule {
}
