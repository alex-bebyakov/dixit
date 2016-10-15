import {ModuleWithProviders} from "@angular/core";
import {Routes, RouterModule} from "@angular/router";
import {RootComponent} from "./root.component";

const rootRoutes: Routes = [
  {
    path: '',
    component: RootComponent
  }
];

export const rootRouting: ModuleWithProviders = RouterModule.forChild(rootRoutes);
