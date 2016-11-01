import {
    Component, OnInit, animate, transition, style, state, trigger, ElementRef
} from '@angular/core';
import {ChatMessage} from "../../../../models/chat.message";
import {MessageService} from "../../../../services/message.service";
import {Subject, Observable} from "rxjs";
import {Http} from "@angular/http";
import {Player} from "../../../../models/player";

@Component({
    inputs: ['chat', 'user'],
    selector: 'chat',
    templateUrl: './chat.component.html',
    styleUrls: ['./chat.component.scss'],
})
export class ChatComponent implements OnInit {

    public message: ChatMessage;
    public messages: Subject<ChatMessage[]> = new Subject<ChatMessage[]>();
    public chat: MessageService<ChatMessage>;
    public user: Player;

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
        this.chat.sendMessage(this.message, '/api/chat').subscribe();
        this.message.text = "";
    }

    scrollToBottom(): void {
        let scrollPane: any = this.el
            .nativeElement.querySelector('.msg-container-base');
        scrollPane.scrollTop = scrollPane.scrollHeight;
    }

}
