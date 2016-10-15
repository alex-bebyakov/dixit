import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {RootComponent} from "./root.component";
import {rootRouting} from "./root.routing";
import {DraggableDirective} from "../../../directives/draggable.directive";

@NgModule({
  imports: [
    CommonModule, rootRouting
  ],
  declarations: [RootComponent,
    DraggableDirective],
  exports: [CommonModule]
})
export class RootModule {
}
