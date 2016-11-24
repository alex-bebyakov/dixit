import {Component, OnInit} from "@angular/core";
import {Router} from "@angular/router";
import {AuthenticationService} from "../../../services/authentication.service";

@Component({
  selector: 'login',
  templateUrl: 'login.component.html',
  styleUrls: ['login.component.scss'],

})

export class LoginComponent implements OnInit {
  model: any = {};
  loading = false;
  error = '';

  constructor(public authenticationService: AuthenticationService, public router: Router) {

  }

  ngOnInit() {
    this.authenticationService.logout();

  }

  login() {
    this.loading = true;
    this.authenticationService.login(this.model.username)
      .subscribe(result => {
        if (result === true) {
          this.router.navigate(['/game']);
        } else {
          this.error = 'Нет такого пользователя';
          this.loading = false;
        }
      });
  }
}
