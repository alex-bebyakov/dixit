import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {RootComponent} from "./root.component";
import {rootRouting} from "./root.routing";
@NgModule({
  imports: [
    CommonModule, rootRouting
  ],
  declarations: [RootComponent],
  exports: [CommonModule]
})
export class RootModule {
}
