import {ModuleWithProviders} from "@angular/core";
import {Routes, RouterModule} from "@angular/router";
import {GameComponent} from "./game.component";
import {RootComponent} from "./root/root.component";
import {AuthGuard} from "../../services/guard.service";


const gameRoutes: Routes = [
  {
    path: 'game',
    component: GameComponent,

    children: [
      {
        path: '',
        component: RootComponent,
        canActivate: [AuthGuard]
      }
    ]
  },
];
export const gameRouting: ModuleWithProviders = RouterModule.forChild(gameRoutes);
