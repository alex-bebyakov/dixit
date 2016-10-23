//take from https://github.com/cornflourblue/angular2-jwt-authentication-example.git

import {Injectable} from "@angular/core";
import {Http, Response, Headers} from "@angular/http";
import {Observable} from "rxjs";
import "rxjs/add/operator/map";


@Injectable()
export class AuthenticationService {
  public token: string;

  constructor(private http: Http) {

  }

  login(username:string): Observable<boolean> {
    var jsonHeaders = new Headers();
    jsonHeaders.append('Content-Type', 'application/json');
    return this.http.post('/api/authenticate', {username: username},{headers:jsonHeaders})
      .map((response: Response) => {
        let token = response.json() && response.json().token;
        if (token) {
          this.token = token;
          localStorage.setItem('currentUser', JSON.stringify({username: username, token: token}));
          return true;
        } else {
          return false;
        }
      });
  }

  logout(): void {
    this.token = null;
    localStorage.removeItem('currentUser');
  }
}
