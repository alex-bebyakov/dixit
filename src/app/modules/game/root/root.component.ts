import {Component, OnInit, ViewChild, ElementRef} from "@angular/core";
import {MessageService} from "../../../services/message.service";
import {Observable} from "rxjs";
import {SocketService} from "../../../services/socket.service";
import {Router} from "@angular/router";
import {User} from "../../../models/user";
import {GameMessage} from "../../../models/game.message";
import {Http} from "@angular/http";
import {Game} from "../../../models/game";
import {Player} from "../../../models/player";
import {ChatComponent} from "./chat/chat.component";
import {MasterMessage} from "../../../models/master.message";

declare var $: any;

@Component({
    selector: 'root',
    templateUrl: 'root.component.html',
    styleUrls: ['root.component.scss']
})
export class RootComponent implements OnInit {
    public userIni: boolean = false;
    public user: User
    public userId: string
    game: Game
    player: Player
    masterMessage: MasterMessage
    private endPoint: SocketService;
    private gameLog: MessageService<GameMessage>;
    public gameMessage: Observable<GameMessage> = new Observable<GameMessage>();
    @ViewChild(ChatComponent) chatComponent: ChatComponent

    constructor(public router: Router, private http: Http, el: ElementRef) {

        this.gameLog = new MessageService<GameMessage>(http);
        this.user = new User();
        this.game = new Game();
        this.player = new Player();
        this.masterMessage = new MasterMessage();
        let username = JSON.parse(localStorage.getItem('currentUser')).username;
        this.endPoint = new SocketService(username);
        this.user.username = username;

    }

    ngOnInit(): void {
        this.endPoint.chatMessageStream.subscribe(data => {
            this.chatComponent.chat.addMessage(data);
        });
        this.endPoint.gameMessageStream.subscribe(data => {
            this.gameLog.addMessage(data);
        });
        this.endPoint.users.subscribe(users=> {
            if (!this.userIni) {
                users.forEach(user=> {
                    if (user.isUser) {
                        this.userIni = true;
                        this.user = user;
                        this.userId = this.endPoint.userId;
                    }
                })
            }
        })

        this.gameMessage = this.gameLog.messages.map((gameMessages: GameMessage[])=> {
            return gameMessages[gameMessages.length - 1];
        });

        this.gameMessage.subscribe((message: GameMessage)=> {
            this.game = message.game;
            this.player = message.player;
            if (message.text !== 'Enter') {
                this.masterMessage.text = message.text
                $('.master-message').change();
            }
        })
    }

    toLoginPage(): void {
        this.router.navigate(['/login']);
    }
}
