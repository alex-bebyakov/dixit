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
  selector: 'header',
  templateUrl: './header.component.html',
  styleUrls: [ './header.component.css' ],
  animations: [
    trigger('headerState', [
      state('inactive', style({
     opacity:1.0,
        transform: 'scale(1)'
      })),
      state('active',   style({
      opacity:0.0,
        transform: 'scale(5)'
      })),
      transition('inactive => active', animate('1s ease-in')),
      transition('active => inactive', animate('100ms ease-out'))
    ])
  ]
})
export class HeaderComponent implements OnInit {
  state: string ='inactive';
  
  togglestates() {
    this.state = (this.state === 'inactive' ? 'active' : 'inactive');
  }
  constructor() {}

  ngOnInit() {
  }

}