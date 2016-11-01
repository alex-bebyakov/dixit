import {Component, OnInit} from '@angular/core';
import {Player} from "../../../../models/player";
import {GameMessage} from "../../../../models/game.message";
import {MessageService} from "../../../../services/message.service";
import {PlayerMessage} from "../../../../models/player.message";
import {Http} from "@angular/http";

@Component({
    inputs: ['player'],
    selector: 'player',
    templateUrl: './player.component.html',
    styleUrls: ['./player.component.scss']
})
export class PlayerComponent implements OnInit {
    player: Player;
    public message: PlayerMessage;

    constructor(private http: Http) {
        this.message = new PlayerMessage();
        this.message.player = this.player;
    }

    ngOnInit() {

    }

    bootstrapGame() {
        this.message.text = "bootstrap";
        new MessageService<PlayerMessage>(this.http).sendMessage(this.message, '/api/game').subscribe();
    }

}
