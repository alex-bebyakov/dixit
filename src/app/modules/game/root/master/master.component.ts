import {OnInit, Component, Input, OnChanges, ElementRef, Renderer, EventEmitter, Output} from "@angular/core";
import {MasterMessage} from "../../../../models/master.message";
import {CaruselService} from "../../../../services/carusel.service";
import {MessageService} from "../../../../services/message.service";
import {Subject, Observable} from "rxjs";
import {Http} from "@angular/http";
declare var $: any;
@Component({
    selector: 'master',
    templateUrl: './master.component.html',
    styleUrls: ['./master.component.scss'],
})
export class MasterComponent implements OnInit {
    public message: MasterMessage;
    public masterMessage: Observable<MasterMessage> = new Observable<MasterMessage>();
    public master: MessageService<MasterMessage>

    constructor(private caruselService: CaruselService, private http: Http) {
        this.message = new MasterMessage;
        this.master = new MessageService<MasterMessage>(http);
    }

    ngOnInit() {
        let angleShow = 60
        let duration = 2000
        $('.master-message').change(function () {
            $(this).css({
                'opacity': '0'
            });
            $(this).animate({
                'opacity': '1'
            }, {
                step: function (now, fx) {
                    $(this).css({
                        "transform": 'rotate3d(1,0,0,' + (now - 1) * angleShow + 'deg)'
                    });
                },
                duration: duration,
                easing: 'linear',
                queue: false,
                complete: function () {

                }
            }, 'linear');


        });
        this.masterMessage = this.master.messages.map((masterMessages: MasterMessage[]) => {
            return masterMessages[masterMessages.length - 1];
        });
        this.masterMessage.subscribe((message: MasterMessage) => {
            this.message = message;
        })
    }

    onAnimate() {
        $('.master-message').change()
    }
}
