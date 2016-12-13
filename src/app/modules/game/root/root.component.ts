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
import {SelectableService} from "../../../services/selectable.service";
import {MasterComponent} from "./master/master.component";
import {CaruselService} from "../../../services/carusel.service";
import {PlayerComponent} from "./player/player.component";

declare var $: any;

@Component({
    selector: 'root',
    templateUrl: 'root.component.html',
    styleUrls: ['root.component.scss']
})
export class RootComponent implements OnInit {
    public userIni: boolean = false;
    public user: User = new User();
    public userId: string
    gameOfPlayer: Game = new Game()
    playerOfPlayer: Player = new Player()
    gameOfTable: Game = new Game()
    playerOfTable: Player = new Player()
    private endPoint: SocketService;
    public tableMessage: Observable<GameMessage> = new Observable<GameMessage>();
    public playerMessage: Observable<GameMessage> = new Observable<GameMessage>();
    playerService: MessageService<GameMessage>
    tableService: MessageService<GameMessage>
    @ViewChild(ChatComponent) chatComponent: ChatComponent
    @ViewChild(MasterComponent) masterComponent: MasterComponent

    constructor(public router: Router, http: Http,
                private caruselService: CaruselService,
                private el: ElementRef,
                private selectableService: SelectableService) {
        let username = JSON.parse(localStorage.getItem('currentUser')).username;
        this.endPoint = new SocketService(username);
        this.user.username = username;
        this.playerService = new MessageService<GameMessage>(http);
        this.tableService = new MessageService<GameMessage>(http);
    }

    ngOnInit(): void {
        this.endPoint.chatMessageStream.subscribe(data => {
            this.chatComponent.chat.addMessage(data);
        });
        this.endPoint.masterMessageStream.subscribe(data => {
            this.masterComponent.master.addMessage(data);
            this.masterComponent.onAnimate()

        });
        this.endPoint.playerMessageStream.subscribe(data => {
            this.playerService.addMessage(data)
        });
        this.endPoint.tableMessageStream.subscribe(data => {
            this.tableService.addMessage(data)
            if (data.game.phase == 'finishing' && !this.selectableService.wasActivated()) {
                this.selectableService.init(this.el)
                this.selectableService.activate(false);
            } else if (data.game.phase == 'selecting' && this.selectableService.wasActivated()) {
                this.selectableService.setWasActivated(false)
            }
        });

        this.tableMessage = this.tableService.messages.map((messages: GameMessage[]) => {
            return messages[messages.length - 1];
        });

        this.tableMessage.subscribe((message: GameMessage) => {
            this.gameOfTable = message.game;
            this.playerOfTable = message.player
        })

        this.playerMessage = this.playerService.messages.map((messages: GameMessage[]) => {
            return messages[messages.length - 1];
        });

        this.playerMessage.subscribe((message: GameMessage) => {
            this.gameOfPlayer = message.game;
            this.playerOfPlayer = message.player
            if (this.caruselService.isActive()) {
                this.caruselService.deactivate()
            }

        })

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
    }

    toLoginPage(): void {
        this.router.navigate(['/login']);
    }
}
