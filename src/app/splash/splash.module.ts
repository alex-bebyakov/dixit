import { NgModule }       from '@angular/core';

import { SplashComponent }     from './splash.component';


import { splashRouting } from './splash.routing';

@NgModule({
  imports: [
    splashRouting
  ],
  declarations: [
    SplashComponent,
  ],

  providers: [

  ]
})
export class SplashModule {}