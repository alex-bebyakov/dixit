import {
    Component, OnInit, animate, transition, style, state, trigger, ElementRef
} from '@angular/core';
import {ChatMessage} from "../../../../models/chat.message";
import {MessageService} from "../../../../services/message.service";
import {Subject, Observable} from "rxjs";
import {SocketService} from "../../../../services/socket.service";
import {Http, Response} from "@angular/http";
import {Player} from "../../../../models/player";

@Component({
    inputs: ['chat', 'user'],
    selector: 'chat',
    templateUrl: './chat.component.html',
    styleUrls: ['./chat.component.scss'],
    animations: [
        trigger('themeState', [
            state('inactive', style({
                transform: 'translateX(0)'

            })),
            state('active', style({
                transform: 'translateX(10%)'

            })),
            transition('inactive => active', animate('3s ease-in')),
            transition('active => inactive', animate('3s ease-out'))
        ])
    ]
})
export class ChatComponent implements OnInit {
    state: string = 'inactive';
    public message: ChatMessage;
    public messages: Subject<ChatMessage[]> = new Subject<ChatMessage[]>();
    public chat: MessageService<ChatMessage>;
    public user: Player;

    togglestates() {
        this.state = (this.state === 'inactive' ? 'active' : 'inactive');
    }

    constructor(public el: ElementRef, private http: Http) {
        this.message = new ChatMessage;


    }


    ngOnInit() {
        this.chat.messages.subscribe(this.messages);
        this.messages.subscribe(
            (messages: Array<ChatMessage>) => {
                setTimeout(() => {
                    this.scrollToBottom();
                });
            });
        this.message.username = this.user.username;
        this.message.img = this.user.avatarImg;
    }

    onChatEnter(event: any) {
        this.chat.sendMessage(this.message).subscribe();
        this.message.text = "";
    }

    scrollToBottom(): void {
        let scrollPane: any = this.el
            .nativeElement.querySelector('.msg-container-base');
        scrollPane.scrollTop = scrollPane.scrollHeight;

    }

}
