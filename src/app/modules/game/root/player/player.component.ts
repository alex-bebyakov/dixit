import {Component, OnInit} from '@angular/core';
import {User} from "../../../../models/user";
import {MessageService} from "../../../../services/message.service";
import {UserMessage} from "../../../../models/user.message";
import {Http} from "@angular/http";
import {CaruselDirective} from "../../../../directives/carusel.directive";


@Component({
    inputs: ['user', 'player', 'game'],
    selector: 'player',
    templateUrl: './player.component.html',
    styleUrls: ['./player.component.scss']
})
export class PlayerComponent implements OnInit {
    user: User;
    game: any;
    player: any;

    public message: UserMessage;
    constructor(private http: Http) {
        this.message = new UserMessage();
        this.message.user = this.user;
    }

    ngOnInit() {
        if (this.user.isUser) {
            this.message.text = "User ".concat(this.user.username).concat(' enter the game!')
            let ms: MessageService<UserMessage> = new MessageService<UserMessage>(this.http);
            ms.sendMessage(this.message, '/api/game').subscribe();
        }
    }

    start() {
        if (!this.game.started && this.game.status === 'starting' && this.player.active) {
            this.message.text = "start";
            new MessageService<UserMessage>(this.http).sendMessage(this.message, '/api/game').subscribe();
        }
    }
}
