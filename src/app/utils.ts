import {Response} from "@angular/http";

declare var $: any;

export class Utils {
    public static httpResponse(response: Response): boolean {
        if (response.status == 200) {
            return true;
        } else {
            return false;
        }
    }

    public static animateImgs(imgs: any, position: number, radius: number, isLeftTurn: boolean): number {
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


    public static animateImg(img: any, position: number, radius: number, isLeftTurn: boolean): void {
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
                if (turn === 1) {
                    if (df_grad > 300 && df_grad <= 360 ||
                        df_grad > -60 && df_grad <= 0 ||
                        df_grad > -420 && df_grad <= -360) {
                        scale = scaleUp
                    } else if (df_grad > 360 && df_grad <= 420 ||
                        df_grad > 0 && df_grad <= 60 ||
                        df_grad > -360 && df_grad <= -300) {
                        scale = scaleDown
                    }
                } else {
                    if (df_grad >= 300 && df_grad < 360 ||
                        df_grad >= -60 && df_grad < 0 ||
                        df_grad >= -420 && df_grad < -360) {
                        scale = scaleDown
                    } else if (df_grad >= 360 && df_grad < 420 ||
                        df_grad >= 0 && df_grad < 60 ||
                        df_grad >= -360 && df_grad < -300) {
                        scale = scaleUp
                    }
                }
                $(img).css({
                    "transform": ' translate3d(' + dx.toString() + 'px,0, ' + dz.toString() + 'px) ' +
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

}


