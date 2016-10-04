import { ModuleWithProviders }   from '@angular/core';
import { Routes, RouterModule }  from '@angular/router';

import { SplashComponent }  from './splash.component';

const splashRoutes: Routes = [
  {
    path: '',
    component: SplashComponent
  }
];

export const splashRouting: ModuleWithProviders = RouterModule.forChild(splashRoutes);