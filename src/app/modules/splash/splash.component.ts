import {Component, OnInit, trigger, state, style, transition, animate} from "@angular/core";
@Component({
  selector: 'splash',
  templateUrl: 'splash.component.html',
  styleUrls: ['splash.component.scss'],

  animations: [
    trigger('splashState', [
      state('inactive', style({
        opacity: 0.0,

      })),
      state('active', style({
        opacity: 1.0,

      })),
      transition('inactive => active', animate('3s ease-in')),
      transition('active => inactive', animate('3s ease-out'))
    ])

  ]
})
export class SplashComponent implements OnInit {
  state: string = 'inactive';

  constructor() {
  }

  ngOnInit() {
    setTimeout(() => this.state = 'active', 100);
  }
}
