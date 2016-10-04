import { Component, 
		OnInit, 
		Input,
		trigger,
		state,
		style,
		transition,
		animate 
} from '@angular/core';

@Component({
	moduleId: module.id,
  selector: 'home',
  templateUrl: './home.component.html',
  styleUrls: [ './home.component.css' ],
  animations: [
    trigger('homeState', [
      state('inactive', style({
     opacity:0.0,
        transform: 'scale(1)'
      })),
      state('active',   style({
      opacity:1.0,
        transform: 'scale(1)'
      })),
      transition('inactive => active', animate('1s ease-in')),
      transition('active => inactive', animate('1s ease-out'))
    ])
  ]
})
export class HomeComponent implements OnInit {
  state: string ='inactive';
  
  togglestates() {
    this.state = (this.state === 'inactive' ? 'active' : 'inactive');
  }
  constructor() {}

  ngOnInit() {
  }

}