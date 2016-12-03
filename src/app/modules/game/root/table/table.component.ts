import {Component, OnInit, Input, OnChanges, ElementRef} from '@angular/core';

import {Game} from "../../../../models/game";
import {Player} from "../../../../models/player";
import {User} from "../../../../models/user";

declare var $: any;

@Component({
    selector: 'table',
    templateUrl: './table.component.html',
    styleUrls: ['./table.component.scss']
})
export class TableComponent implements OnInit, OnChanges {
    @Input() user: User;
    @Input() player: Player
    @Input() game: Game
    @Input() userId: string


    constructor(private el: ElementRef) {

    }

    ngOnInit() {

    }

    ngOnChanges():void {
        if (this.game.phase === 'finishing') {
            /*let items = $(".selectable").children('.table-card-image')
            console.log(items)
            for (var i = 0; i < items.length; i++) {
                $(items[i]).css({
                    'width': '124px'

                });
            }*/

        }
    }
}
