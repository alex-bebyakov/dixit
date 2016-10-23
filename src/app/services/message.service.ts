import {Injectable} from '@angular/core';
import {Subject, Observable}     from 'rxjs';
import {Message} from '../models/message';


let initialMessages: Message[] = [];

interface IMessagesOperation extends Function {
  (messages: Message[]): Message[];
}

@Injectable()
export class MessageService<T extends Message> {

  newMessages: Subject<Message> = new Subject<Message>();
  messages: Observable<Message[]>;
  updates: Subject<any> = new Subject<any>();
  create: Subject<Message> = new Subject<Message>();

  constructor() {
    this.messages = this.updates
      .scan((messages: Message[],
             operation: IMessagesOperation) => {
          return operation(messages);
        },
        initialMessages)
      .publishReplay(1)
      .refCount();
    this.create
      .map(function (message: Message): IMessagesOperation {
        return (messages: Message[]) => {
          return messages.concat(message);
        };
      })
      .subscribe(this.updates);
    this.newMessages
      .subscribe(this.create);
  }

  addMessage(message: Message): void {
    this.newMessages.next(message);
  }
}
