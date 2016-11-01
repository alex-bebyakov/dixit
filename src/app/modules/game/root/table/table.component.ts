import {Component, OnInit} from '@angular/core';
import {GameService} from "../../../../services/game.service";
import {Response} from "@angular/http";
import {MessageService} from "../../../../services/message.service";
import {GameMessage} from "../../../../models/game.message";
import {Subject} from "rxjs";

@Component({
    inputs: ['game'],
    selector: 'table',
    templateUrl: './table.component.html',
    styleUrls: ['./table.component.scss']
})
export class TableComponent implements OnInit {
    public game: MessageService<GameMessage>;
    public messages: Subject<GameMessage[]> = new Subject<GameMessage[]>();
    constructor() {
    }

    ngOnInit() {
        this.game.messages.subscribe(this.messages);
    }


}
