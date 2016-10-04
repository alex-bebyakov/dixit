import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NavbarModule}  from './navbar/navbar.module';
import { SplashModule }  from './splash/splash.module';
import { FooterModule}  from './footer/footer.module';
import { AppComponent }  from './app.component';

import { routing,
         appRoutingProviders }  from './app.routing';

@NgModule({
  imports: [ BrowserModule,NavbarModule, SplashModule,FooterModule,routing],
  declarations: [ AppComponent ],
  bootstrap:    [ AppComponent]
})
export class AppModule { 

}
