import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {RootComponent} from "./root.component";
import {rootRouting} from "./root.routing";
import {DraggableDirective} from "../../../directives/draggable.directive";
import {PlayerComponent} from './player/player.component';
import {ChatComponent} from './chat/chat.component';
import {TableComponent} from './table/table.component';

@NgModule({
  imports: [
    CommonModule, rootRouting
  ],
  declarations: [RootComponent,
      DraggableDirective,
      PlayerComponent,
      ChatComponent,
      TableComponent],
  exports: [CommonModule]
})
export class RootModule {
}
