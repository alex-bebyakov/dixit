import {Component, OnInit, ElementRef} from "@angular/core";
import {MessageService} from "../../../services/message.service";
import {ChatMessage} from "../../../models/chat.message";
import {Observable, Subject, BehaviorSubject} from "rxjs";
import {SocketService} from "../../../services/socket.service";
import {Router} from "@angular/router";
import {Player} from "../../../models/player";
import {el} from "@angular/platform-browser/testing/browser_util";


@Component({
    selector: 'root',
    templateUrl: 'root.component.html',
    styleUrls: ['root.component.scss']
})
export class RootComponent implements OnInit {

    public players: Observable<Array<Player>>;
    public userIni: boolean = false;
    public user: Player;
    private endPoint: SocketService;

    constructor(public chatService: MessageService<ChatMessage>,
                public router: Router) {
        this.endPoint = new SocketService();
        this.endPoint.setUsername(JSON.parse(localStorage.getItem('currentUser')).username);

    }

    ngOnInit(): void {

        this.endPoint.chatMessageStream.subscribe(data => {
            this.chatService.addMessage(data);
        });
        this.players = this.endPoint.usersStream.map(data=> {
            let players: Array<Player> = new Array<Player>();
            data.forEach(element=> {
                let p: Player = new Player();
                p.username = element.username;
                p.avatarImg = element.avatarImg;
                p.isUser = (element.socketId === this.endPoint.userId);
                players.push(p);
            });
            return players;
        }).publishReplay(1).refCount();

        this.players.subscribe(players=> {
            if (!this.userIni) {
                players.forEach(player=> {
                    if (player.isUser) {
                        this.user = player;
                        this.userIni = true;
                    }
                })
            }
        })


    }

    toLoginPage(): void {
        this.router.navigate(['/login']);
    }
}
