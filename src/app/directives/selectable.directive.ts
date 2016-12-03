import {Directive, Renderer, ElementRef, HostListener, EventEmitter, Input} from '@angular/core';
import {UserMessage} from "../models/user.message";
import {Http} from "@angular/http";
import {User} from "../models/user";
import {MessageService} from "../services/message.service";
import {Card} from "../models/card";
import {element} from "protractor";
declare var $: any;
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
    _isDisactivate:boolean = true
    card=new Card()
    constructor(private http: Http, el: ElementRef, renderer: Renderer) {
        renderer.setElementClass(el.nativeElement, "selectable", true);
        this.message = new UserMessage();
        let element = $(el.nativeElement)
        element.change(function () {
            let items = $(element).children('.table-card-image')
            let length = items.length
            let dx = length * 118.125 * 9 / 20 - 20;
            element.css({
                'display': 'block',
                'position': 'absolute',
                'transform': 'translate(' + dx + 'px,0px) scale(1.8)',
                'z-index': '10'
            });
            element.attr('isDisactivate','false')

        })
    }

    @HostListener('click', ['$event']) onClick(e) {
        let items = $(".selectable").children('.table-card-image')
        let length = items.length
        if (this._isActive) {
            let dx = length * 118.125 * 9 / 20 - 20;
            if (!this.isSelect) {
                $(".selectable").css({
                    'display': 'block',
                    'position': 'absolute',
                    'transform': 'translate(' + dx + 'px,0px) scale(1.8)',
                    'z-index': '10'
                });

                this.isSelect = true;
                for (var i = 0; i < length; i++) {
                    $(items[i]).hover(
                        function () {
                            $(this).css({
                                'transform': 'scale(1.3)',
                                'transition': '1s'
                            });
                        }, function () {
                            $(this).css({
                                'transform': 'scale(1)',
                                'transition': '1s'
                            });
                        }
                    );
                }

            } else {
                $(".selectable").css({
                    'transform': 'translate(0px,0px)',
                    'z-index': '0'
                });
                for (var i = 0; i < length; i++) {
                    $(items[i]).css({
                        'transform': 'scale(1)',

                    });
                    $(items[i]).hover(
                        function () {
                            $(this).css({
                                'transform': 'scale(1)',
                            });
                        }, function () {
                            $(this).css({
                                'transform': 'scale(1)',
                            });
                        }
                    );
                }
                this.isSelect = false;
                if (this._user.isUser) {
                    this.message.user = this._user;
                    this.message.userId = this._userId;
                    this.message.command = "SelectCard";
                    this.card.img=$(e.path[0]).attr('src');
                    this.message.card =this.card;
                    new MessageService<UserMessage>(this.http).sendMessage(this.message, '/api/game').subscribe(resp=> {

                    });
                    this.message.command = "";
                    this.message.text = "";
                }
            }
        }
        else {
            if($(".selectable").attr('isDisactivate')=='false'){
                $(".selectable").css({
                    'transform': 'translate(0px,0px)',
                    'z-index': '0'
                });
                for (var i = 0; i < length; i++) {
                    $(items[i]).css({
                        'transform': 'scale(1)',

                    });
                }

                if (this._user.isUser) {
                    this.message.user = this._user;
                    this.message.userId = this._userId;
                    this.message.command = "FinishRound";
                    new MessageService<UserMessage>(this.http).sendMessage(this.message, '/api/game').subscribe(
                        resp=>{$(".selectable").attr('isDisactivate',resp.toString())}
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
