import {Component, OnInit, Input, OnChanges, ElementRef} from '@angular/core';

import {Game} from "../../../../models/game";
import {User} from "../../../../models/user";
import {Player} from "../../../../models/player";

@Component({
    selector: 'table',
    templateUrl: './table.component.html',
    styleUrls: ['./table.component.scss']
})
export class TableComponent implements OnInit {
    @Input() user: User;
    @Input() userId: string
    @Input() game: Game
    @Input() player: Player

    constructor() {

    }

    ngOnInit() {

    }


    setTransform(isOff) {
        if (isOff) {
            return 'scale(1.3)'
        }
    }
}
