import {Injectable, ElementRef} from "@angular/core";

declare var $: any;

@Injectable()
export class CaruselService {
    private element: any
    private imgs: any;
    private imgClass: string
    private dx: string
    private dy: string
    private perspective: string
    private radius: number
    private position: number = 0;

    constructor(el: ElementRef, attributes: string[]) {
        this.element = $(el.nativeElement);
        this.imgClass = this.element.attr(attributes[0]);
        this.dx = this.element.attr(attributes[1]);
        this.dy = this.element.attr(attributes[2]);
        this.perspective = this.element.attr(attributes[3]);
        this.radius = parseInt(this.element.attr(attributes[4]));

    }

    rotate(isTurnLeft: boolean): any {
        this.position = this.animateImgs(this.imgs, this.position, this.radius, isTurnLeft)
    }

    activate(): any {
        this.imgs = this.element.children(this.imgClass)
        this.element.css({
            'transform-style': 'preserve-3d',
            'transform-origin': '50% 50%',
            'transform': ' translate(' + this.dx + ',' + this.dy + ') perspective(' + this.perspective + ')'
        })
        for (let i = 0; i < 6; i++) {
            $(this.imgs[i]).css({
                'position': 'absolute',
                'height': '177px',
                'width': '119px'
            })
        }
    }

    deactivate(): any {
        for (let i = 0; i < 6; i++) {
            $(this.imgs[i]).css({
                'position': 'relative',
                'transform': 'scale(1)',
                'height': '118px',
                'width': '79px'

            })
        }
        this.element.css({
            'transform': 'translate(0px, 0px)'
        })
    }

    private animateImg = function (img: any, position: number, radius: number, isLeftTurn: boolean): void {
        var turn = 1;
        if (isLeftTurn) {
            turn = -1;
        }
        $(img).animate({
            'opacity': '60'
        }, {
            step: function (now, fx) {
                var df = (60 * position + now * turn) * Math.PI / 180
                var df_grad = 60 * position + now * turn
                var dz = -radius * (1 - Math.cos(df))
                var dx = radius * Math.sin(df)
                var scaleUp = now / 60 + 1;
                var scaleDown = 2 - now / 60;
                var scale = 1;
                var dy = 0;
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
            this.animateImg(imgs[i], index + i, radius, isLeftTurn);
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


