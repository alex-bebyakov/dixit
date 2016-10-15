//take from https://github.com/cornflourblue/angular2-jwt-authentication-example.git

import {Injectable} from "@angular/core";
import {Router, CanActivate} from "@angular/router";

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(private router: Router) {
  }

  canActivate() {
    if (localStorage.getItem('currentUser')) {
      return true;
    }
    this.router.navigate(['/login']);
    return false;
  }
}
