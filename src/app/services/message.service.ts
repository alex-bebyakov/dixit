import {Injectable} from '@angular/core';
import {Subject, Observable}     from 'rxjs';
import {IMessage} from '../interfaces/message';
import {Response, Http} from "@angular/http";
import {Utils} from "../utils";
import {IMessagesOperation} from "../interfaces/messages.operation";


let initialMessages: IMessage[] = [];

@Injectable()
export class MessageService<T extends IMessage> {

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

    sendMessage(message: T, url: string): Observable<boolean> {
        return this.http.post(url, message).map((response: Response) => {
            return Utils.httpResponse(response);
        });
    }

}
