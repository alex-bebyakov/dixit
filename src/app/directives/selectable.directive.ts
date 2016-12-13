import {Directive, ElementRef, HostListener, EventEmitter, Input} from '@angular/core';
import {UserMessage} from "../models/user.message";
import {Http} from "@angular/http";
import {User} from "../models/user";
import {MessageService} from "../services/message.service";
import {Card} from "../models/card";
import {SelectableService} from "../services/selectable.service";

@Directive({
    selector: '[appSelectable]'
})
export class SelectableDirective {
    public click = new EventEmitter();
    private isSelect = false
    message: UserMessage;
    _user: User;
    _userId: string
    _isActive: boolean = false
    card = new Card()

    constructor(private http: Http, private el: ElementRef, private selectableService: SelectableService) {
        this.message = new UserMessage();
    }

    @HostListener('click', ['$event']) onClick(e) {
        this.selectableService.update(this.el);
        if (this._isActive) {
            if (!this.isSelect) {
                this.selectableService.activate(true)
                this.isSelect = true;
            } else {
                this.selectableService.select()
                this.isSelect = false;
                if (this._user.isUser) {
                    this.message.username = this._user.username;
                    this.message.userId = this._userId;
                    this.message.command = "SelectCard";
                    this.card.img = this.selectableService.getSrc(e)
                    this.message.card = this.card;
                    new MessageService<UserMessage>(this.http).sendMessage(this.message, '/api/game').subscribe();
                    this.message.command = "";
                    this.message.text = "";
                }
            }
        }
        else {
            if (this.selectableService.isDisactivate() == 'false') {
                this.selectableService.deactivate()
                if (this._user.isUser) {
                    this.message.username = this._user.username;
                    this.message.userId = this._userId;
                    this.message.command = "FinishRound";
                    new MessageService<UserMessage>(this.http).sendMessage(this.message, '/api/game').subscribe(
                        resp => {
                            this.selectableService.setAttribute('isDisactivate', resp.toString())
                        }
                    );
                    this.message.command = "";
                    this.message.text = "";
                }
            }
        }
    }

    @Input() set isActive(isActive) {
        this._isActive = isActive
    }

    @Input() set user(user: User) {
        this._user = user
    }

    @Input() set userId(userId) {
        this._userId = userId
    }
}
