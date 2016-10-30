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


        this.endPoint.players.subscribe(players=> {
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
