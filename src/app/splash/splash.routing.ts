import {ModuleWithProviders} from "@angular/core";
import {Routes, RouterModule} from "@angular/router";
import {SplashComponent} from "./splash.component";
import {loginRoutes} from "./login/login.routing";
import {menuRoutes} from "./menu/menu.routing";

const splashRoutes: Routes = [
  {
    path: '',
    component: SplashComponent,
    children: [
      ...loginRoutes,
      ...menuRoutes
    ]
  }
];

export const splashRouting: ModuleWithProviders = RouterModule.forChild(splashRoutes);
