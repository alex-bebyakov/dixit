import {Component, OnInit, Input} from '@angular/core';
import {User} from "../../../../models/user";
import {MessageService} from "../../../../services/message.service";
import {UserMessage} from "../../../../models/user.message";
import {Http} from "@angular/http";

import {Player} from "../../../../models/player";
import {Game} from "../../../../models/game";
import {CaruselService} from "../../../../services/carusel.service";

declare var $: any;
@Component({
    selector: 'player',
    templateUrl: './player.component.html',
    styleUrls: ['./player.component.scss']
})
export class PlayerComponent implements OnInit {
    @Input() user: User;
    @Input() userId: string
    @Input() game: Game
    @Input() player: Player
    message: UserMessage;

    constructor(private http: Http, private caruselService: CaruselService) {
        this.message = new UserMessage();
    }

    ngOnInit() {
        if (this.user.isUser) {
            this.message.username = this.user.username;
            this.message.userId = this.userId;
            this.message.command = "Enter";
            new MessageService<UserMessage>(this.http).sendMessage(this.message, '/api/game').subscribe();
        }

    }

    start() {
        if (!(this.game.started) && this.game.status === 'starting' && this.player.active) {
            this.message.command = "Start";
            new MessageService<UserMessage>(this.http).sendMessage(this.message, '/api/game').subscribe();
            this.message.command = "";
        }
    }

    send() {
        if (this.player.status == 'asker' || this.game.phase == 'answering') {
            this.message.command = "SendCard"
            this.message.card = this.caruselService.getCard();
            if (this.player.status == 'answer') {
                this.message.text = 'answer'
            }
            new MessageService<UserMessage>(this.http).sendMessage(this.message, '/api/game').subscribe();
            this.message.command = "";
            this.message.text = "";
        }
        this.caruselService.deactivate()
    }

}
