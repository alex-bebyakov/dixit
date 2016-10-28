import {Injectable} from '@angular/core';
import {Subject, Observable}     from 'rxjs';
import {Message} from '../models/message';
import {Response, Http} from "@angular/http";


let initialMessages: Message[] = [];

interface IMessagesOperation extends Function {
  (messages: Message[]): Message[];
}

@Injectable()
export class MessageService<T extends Message> {

    newMessages: Subject<T> = new Subject<T>();
    messages: Observable<T[]>;
  updates: Subject<any> = new Subject<any>();
    create: Subject<T> = new Subject<T>();

    constructor(private http: Http) {
    this.messages = this.updates
        .scan((messages: T[],
               operation: IMessagesOperation) => {
          return operation(messages);
        },
        initialMessages)
      .publishReplay(1)
      .refCount();
    this.create
        .map(function (message: T): IMessagesOperation {
            return (messages: T[]) => {
          return messages.concat(message);
        };
      })
      .subscribe(this.updates);
    this.newMessages
      .subscribe(this.create);
  }

    addMessage(message: T): void {
    this.newMessages.next(message);
  }

    sendMessage(message: T): Observable<boolean> {
        return this.http.post('/api/chatMessage', message).map((response: Response) => {
            if (response.status == 200) {
                return true;
            } else {
                return false;
            }
        });
    }

}
