import {Component, OnInit} from "@angular/core";
import {MessageService} from "../../../services/message.service";
import {ChatMessage} from "../../../models/chat.message";
import {Observable} from "rxjs";
import {SocketService} from "../../../services/socket.service";
import {Router} from "@angular/router";
import {User} from "../../../models/user";
import {GameMessage} from "../../../models/game.message";
import {Http} from "@angular/http";
import {Game} from "../../../models/game";
import {Player} from "../../../models/player";


@Component({
    selector: 'root',
    templateUrl: 'root.component.html',
    styleUrls: ['root.component.scss']
})
export class RootComponent implements OnInit {
    public userIni: boolean = false;
    public user: User
    private endPoint: SocketService;
    private gameLog: MessageService<GameMessage>;
    private chatLog: MessageService<ChatMessage>;
    public gameMessage: Observable<GameMessage>;
    public game: Game;
    public player: Player;

    constructor(public router: Router, private http: Http) {

        this.gameLog = new MessageService<GameMessage>(http);
        this.chatLog = new MessageService<ChatMessage>(http);
        this.user = new User();
        let username = JSON.parse(localStorage.getItem('currentUser')).username;
        this.endPoint = new SocketService(username);
        this.user.username = username;
        this.gameMessage = new Observable<GameMessage>();
        this.game = new Game();
        this.player = new Player();
    }

    ngOnInit(): void {
        this.endPoint.chatMessageStream.subscribe(data => {
            this.chatLog.addMessage(data);
        });
        this.endPoint.gameMessageStream.subscribe(data => {
            this.gameLog.addMessage(data);
        });
        this.endPoint.users.subscribe(users=> {
            if (!this.userIni) {
                users.forEach(user=> {
                    if (user.isUser) {
                        this.user = user;
                        this.userIni = true;
                    }
                })
            }
        })
        this.gameMessage = this.gameLog.messages.map((gameMessages: GameMessage[])=> {
            return gameMessages[gameMessages.length - 1];
        });
        this.gameMessage.subscribe(msg=> {
            console.log(msg)
        })
        this.gameMessage.subscribe(message=> {
            this.game = message.game;
            this.player = message.player
        });
    }

    toLoginPage(): void {
        this.router.navigate(['/login']);
    }
}
