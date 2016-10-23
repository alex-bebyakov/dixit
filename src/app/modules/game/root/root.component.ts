import {Component, OnInit, ElementRef} from "@angular/core";
import {MessageService} from "../../../services/message.service";
import {ChatMessage} from "../../../models/chat.message";
import {Observable, Subject} from "rxjs";
import {SocketService} from "../../../services/socket.service";

@Component({
  selector: 'root',
  templateUrl: 'root.component.html',
  styleUrls: ['root.component.scss']
})
export class RootComponent implements OnInit {

  socketIdStream: Subject<any> = new Subject<any>();
  usersStream: Subject<any> = new Subject<any>();
  chatMessageStream: Subject<any> = new Subject<any>();
  chatMessage: ChatMessage;
  chatMessages: Subject<any> = new Subject<any>();
  currentUser: any;

  constructor(public chatService: MessageService<ChatMessage>,
              public el: ElementRef,
              public endPoint: SocketService) {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    this.socketIdStream = this.endPoint.createStream('socketId');
    this.usersStream = this.endPoint.createStream('usersMap');
    this.chatMessageStream = this.endPoint.createStream('chatMessage');
    this.chatMessage = new ChatMessage;
  }

  ngOnInit(): void {
    this.chatService.messages.subscribe(this.chatMessages);
    this.socketIdStream.subscribe(data => {
      this.endPoint.send('client connect', {
        username: this.currentUser.username,
        socketId: data.socketId,
        connectTime: data.connectTime
      });
    });
    this.usersStream.subscribe(data => {
      //ToDo: rewrite state of players-list
    });
    this.chatMessageStream.subscribe(data => {
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
}
