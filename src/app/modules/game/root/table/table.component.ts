import {Component, OnInit} from '@angular/core';
import {GameMessage} from "../../../../models/game.message";
import {Subject, Observable} from "rxjs";
import {Map} from "immutable";

@Component({
    selector: 'table',
    templateUrl: './table.component.html',
    styleUrls: ['./table.component.scss']
})
export class TableComponent implements OnInit {
    public game: Subject<GameMessage>;


    constructor() {
    }

    ngOnInit() {

    }


}
