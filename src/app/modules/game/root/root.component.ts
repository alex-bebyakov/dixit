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
import {SelectableService} from "../../../services/selectable.service";
import {MasterComponent} from "./master/master.component";
import {CaruselService} from "../../../services/carusel.service";


declare var $: any;

@Component({
    selector: 'root',
    templateUrl: 'root.component.html',
    styleUrls: ['root.component.scss']
})
export class RootComponent implements OnInit {
    public userIni: boolean = false;
    public mippleIni: boolean = false;
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
    mipple_dx:Array<number>=[]
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
        for (let i = 0; i <6; i++) {
            this.mipple_dx[i]=0
        }

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
            }
            else if (data.game.phase == 'selecting' && !this.selectableService.wasActivated()) {
                this.selectableService.init(this.el)
                if(this.playerOfTable.tableActive){
                    this.selectableService.activate(true)
                }
            }
            else if(data.game.phase == 'asking'){
                this.selectableService.setWasActivated(false)
                for (let i = 0; i <data.game.playersNames.length; i++) {
                    this.mipple_dx[i]=data.game.scores[i]*20
                    let dx=this.mipple_dx[i]
                    let cl='.mipple_'
                        .concat(i.toString())
                        .concat('-image')
                    $(cl).css({
                        'transform':'translate(0px,0px)'
                    })
                    $(cl).css({
                        'transform':'translate(' + dx + 'px,0px)'
                    })
                }
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
            users.forEach(user=> {
                if (user.isUser) {
                    this.userIni = true;
                    this.user = user;
                    this.userId = this.endPoint.userId;
                }
            })
            for (let i = 0; i <6; i++) {
                let cl='.mipple_'
                    .concat(i.toString())
                    .concat('-image')
                if( $(cl)[0]){
                    $(cl)[0].remove()
                }

            }
            for (let i = 0; i <users.length; i++) {
                let element='<div class="mipple_'
                    .concat(i.toString())
                    .concat('-image"> <img src="assets/images/')
                    .concat('mipple_')
                    .concat(i.toString())
                    .concat('.png" class="img-fluid"/> </div>')

                let dx=this.mipple_dx[i]
                $(element).appendTo('.navbar-fixed-top').css({
                    'overflow': 'hidden',
                    'margin-top':'5px',
                    'margin-left':'-15px',
                    'width': '20px',
                    'height': '40px',
                    'float': 'left',
                    'display': 'inline-block',
                    'transform':'translate(' + dx + 'px,0px)'
                })
            }
            $('.finish-flag').remove()
            let element='<div class="finish-flag"> <img src="assets/images/finish.png" class="img-fluid"/> </div>'

            $(element).appendTo('.navbar-fixed-top').css({
                'overflow': 'hidden',
                'margin-top':'5px',
                'width': '20px',
                'height': '40px',
                'float': 'left',
                'display': 'inline-block',
                'transform':'translate(640px,0px)'
            })
        })
    }

    toLoginPage(): void {
        this.router.navigate(['/login']);
    }
}
