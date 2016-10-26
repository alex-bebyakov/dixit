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
    public chatMessage: ChatMessage;
    public chatMessages: Subject<any> = new Subject<any>();
    private endPoint: SocketService;
    public dummyPlayer: Player;

    constructor(public chatService: MessageService<ChatMessage>,
                public el: ElementRef,
                public router: Router) {
        this.endPoint = new SocketService();
        this.endPoint.setUsername(JSON.parse(localStorage.getItem('currentUser')).username);
        this.chatMessage = new ChatMessage;
        this.dummyPlayer = new Player();
        this.dummyPlayer.isUser = false;
        this.dummyPlayer.username = "dummy";
        this.dummyPlayer.avatarImg = "assets/images/avatar-default-1.jpg";
    }

    ngOnInit(): void {
        this.chatService.messages.subscribe(this.chatMessages);

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

        this.players.subscribe(names=> {
        })

        this.endPoint.chatMessageStream.subscribe(data => {
            this.chatService.addMessage(data);
        });


    }

    onChatEnter(event: any): void {
        this.endPoint.send('chatMessage', this.chatMessage)
        event.preventDefault();
    }

    scrollToBottom(): void {
        let scrollPane: any = this.el
            .nativeElement.querySelector('.msg-container-base');
        scrollPane.scrollTop = scrollPane.scrollHeight;
    }

    toLoginPage(): void {
        this.router.navigate(['/login']);
    }
}
