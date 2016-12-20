import {Injectable, ElementRef} from "@angular/core";
import {Card} from "../models/card";

declare var $: any;

@Injectable()
export class CaruselService {
    private element: any
    private imgs: any;
    private arrows: any
    private imgClass: string
    private arrowClass: string
    private askInputClass: string
    private answerInputClass: string
    private dx: string
    private dy: string
    private perspective: string
    private radius: number
    private position: number = 0;
    private _isActive: boolean = false;
    private card: Card

    constructor() {

    }

    initialize(el: ElementRef, attrs: string[]) {
        this.element = $(el.nativeElement);

        this.imgClass = this.element.attr(attrs[0]);
        this.arrowClass = this.element.attr(attrs[1]);
        this.askInputClass = this.element.attr(attrs[2]);
        this.answerInputClass = this.element.attr(attrs[3]);
        this.dx = this.element.attr(attrs[4]);
        this.dy = this.element.attr(attrs[5]);
        this.perspective = this.element.attr(attrs[6]);
        this.radius = parseInt(this.element.attr(attrs[7]));
        this.card = new Card()
    }

    activate(activationType: boolean): any {

        this.radius = this.element.width() / 2
        this.dx = '-10vw';
        this.dy = '-20vw'
        this.imgs = this.element.children(this.imgClass)
        this.arrows = this.element.children(this.arrowClass)
        this.element.css({
            'transform-style': 'preserve-3d',
            'transform-origin': '50% 50%',
            'transform': ' translate(' + this.dx + ',' + this.dy + ') perspective(' + this.perspective + ')'
        })
        for (let i = 0; i < 6; i++) {
            $(this.imgs[i]).css({
                'position': 'absolute',
                'height': '12vw',
                'width': '8vw'
            })
        }
        for (let i = 0; i < 2; i++) {
            let shift = 0
            if ($(this.arrows[i]).attr("type") === 'left') {
                shift = 25
                $(this.arrows[i]).children('.img-fluid').attr("src", 'assets/images/left_arrow.png')
            } else {
                shift = 46.5
                $(this.arrows[i]).children('.img-fluid').attr("src", 'assets/images/right_arrow.png')
            }
            $(this.arrows[i]).css({
                'display': 'block',
                'position': 'absolute',
                'height': '38px',
                'width': '38px',
                'transform': ' translate(' + shift + 'vw,15vw)',
                'opacity': '1'
            })
        }
        if (activationType) {
            $(this.askInputClass).css({
                'display': 'block',
                'position': 'absolute',
                'transform': ' translate(48vw,20vw)',
                'background-image': "url('assets/images/backgrounds/chat.png')",
                'border-radius': '0.5em',
                'opacity': '1'
            })
        } else {
            $(this.answerInputClass).css({
                'display': 'block',
                'position': 'absolute',
                'transform': ' translate(48vw,21vw)',
                'opacity': '1'
            })
        }
        this._isActive = true;
        this.card.asking = activationType;
    }

    deactivate(): void {
        for (let i = 0; i < 6; i++) {
            $(this.imgs[i]).css({
                'position': 'relative',
                'transform': 'scale(1)',
                'height': '9vw',
                'width': '6vw'
            })
        }
        this.element.css({
            'transform': 'translate(0px, 0px)'
        })
        for (let i = 0; i < 2; i++) {
            $(this.arrows[i]).css({
                'transform': 'translate(0px, 0px)',
                'display': 'none'
            })
        }
        $(this.askInputClass).css({
            'transform': 'translate(0px, 0px)',
            'display': 'none'
        })
        $(this.answerInputClass).css({
            'transform': 'translate(0px, 0px)',
            'display': 'none'
        })
        this._isActive = false;
    }

    animate(isTurnLeft: boolean): any {
        this.position = this.animateImgs(this.imgs, this.position, this.radius, isTurnLeft)
        if (this.position < 0) {
            this.card.img = $(this.imgs[-this.position]).children('.img-fluid').attr('src');

        } else if (this.position > 0) {
            this.card.img = $(this.imgs[6 - this.position]).children('.img-fluid').attr('src');
        } else {
            this.card.img = $(this.imgs[this.position]).children('.img-fluid').attr('src');
        }

    }

    isActive(): boolean {
        return this._isActive;
    }

    getCard(): Card {
        return this.card;
    }

    getType(event) {
        return $(event.target).parent().attr('type')
    }

    private animateImg = function (img: any, position: number, radius: number, isLeftTurn: boolean): any {
        let turn = 1;
        let dy = 0;
        if (isLeftTurn) {
            turn = -1;
        }
        $(img).animate({
            'opacity': '60'
        }, {
            step: function (now, fx) {
                let df = (60 * position + now * turn) * Math.PI / 180
                let df_grad = 60 * position + now * turn
                let dz = -radius * (1 - Math.cos(df))
                let dx = radius * Math.sin(df)
                let scaleUp = now / 60 + 1;
                let scaleDown = 2 - now / 60;
                let scale = 1;
                if (turn === 1) {
                    if (df_grad > 300 && df_grad <= 360 ||
                        df_grad > -60 && df_grad <= 0 ||
                        df_grad > -420 && df_grad <= -360) {
                        scale = scaleUp
                        dy = 100 * now / 60
                    } else if (df_grad > 360 && df_grad <= 420 ||
                        df_grad > 0 && df_grad <= 60 ||
                        df_grad > -360 && df_grad <= -300) {
                        scale = scaleDown
                        dy = 100 * (1 - now / 60)
                    }
                } else {
                    if (df_grad >= 300 && df_grad < 360 ||
                        df_grad >= -60 && df_grad < 0 ||
                        df_grad >= -420 && df_grad < -360) {
                        scale = scaleDown
                        dy = 100 * (1 - now / 60)

                    } else if (df_grad >= 360 && df_grad < 420 ||
                        df_grad >= 0 && df_grad < 60 ||
                        df_grad >= -360 && df_grad < -300) {
                        scale = scaleUp
                        dy = 100 * now / 60
                    }
                }
                $(img).css({
                    "transform": ' translate3d(' + dx.toString() + 'px,' + dy.toString() + 'px,' + dz.toString() + 'px) ' +
                    'rotate3d(0,1,0,' + df_grad + 'deg) ' +
                    'scale(' + scale + ')'

                });
            },
            duration: 1000,
            easing: 'linear',
            queue: false,
            complete: function () {

            }
        }, 'linear');

    }

    private animateImgs = function (imgs: any, position: number, radius: number, isLeftTurn: boolean): number {
        var index = position

        for (let i = 0; i < 6; i++) {
            this.animateImg(imgs[i], index + i, radius, isLeftTurn)

        }
        if (isLeftTurn) {
            index--
            if (index < -5) {
                index = 0
            }
        } else {
            index++
            if (index > 5) {
                index = 0
            }
        }
        return index
    }
}
