import {Directive, ElementRef} from '@angular/core';

declare var $: any;
@Directive({
    selector: '[appNotification]'
})
export class NotificationDirective {
    constructor(private el: ElementRef) {
        let angleShow = 60
        let angleHide = 30
        let duration = 2000
        let timeOut = 1000
        let element = $(el.nativeElement)
        element.change(function () {
            element.css({
                'opacity': '0'
            });
            element.animate({
                'opacity': '1'
            }, {
                step: function (now, fx) {
                    element.css({
                        "transform": 'rotate3d(1,0,0,' + (now - 1) * angleShow + 'deg)'
                    });
                },
                duration: duration,
                easing: 'linear',
                queue: false,
                complete: function () {
                    /*setTimeout(function () {element.animate({
                     'opacity': '0'
                     }, {
                     step: function (now, fx) {
                     element.css({
                     "transform": 'rotate3d(1,0,0,' + (now-1)*angleHide + 'deg)'
                     });
                     },
                     duration: duration,
                     easing: 'linear',
                     queue: false,
                     complete: function () {

                     }
                     }, 'linear');},timeOut)*/
                }
            }, 'linear');

        });
    }


}

