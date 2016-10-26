import {Component, OnInit} from '@angular/core';
import {Player} from "../../../../models/player";

@Component({
    inputs: ['player'],

    selector: 'player',
    templateUrl: './player.component.html',
    styleUrls: ['./player.component.scss']
})
export class PlayerComponent implements OnInit {
    player: Player;

    constructor() {
    }

    ngOnInit() {

    }

}
