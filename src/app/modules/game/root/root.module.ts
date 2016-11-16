import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {RootComponent} from "./root.component";
import {rootRouting} from "./root.routing";
import {DraggableDirective} from "../../../directives/draggable.directive";
import {PlayerComponent} from './player/player.component';
import {ChatComponent} from './chat/chat.component';
import {TableComponent} from './table/table.component';
import {FormsModule} from "@angular/forms";
import {CaruselDirective} from "../../../directives/carusel.directive";
@NgModule({
  imports: [
      CommonModule, rootRouting, FormsModule
  ],
  declarations: [RootComponent,
      DraggableDirective,
      CaruselDirective,
      PlayerComponent,
      ChatComponent,
      TableComponent],
    exports: [CommonModule, FormsModule]
})
export class RootModule {
}
