import {Injectable, ElementRef} from "@angular/core";

declare var $: any;

@Injectable()
export class SelectableService {
    private element: any
    private items: any;
    private _wasActivated = false

    constructor() {
    }

    init(el: ElementRef) {
        this.element = $(el.nativeElement).find('.table-root')
        this.items = $(this.element).children('.table-card')
    }

    update(el: ElementRef) {
        this.element = $(el.nativeElement);
        this.items = $(this.element).children('.table-card')
    }

    activate(activateType): any {
        let dx = this.items.length * 118.125 * 9 / 20 - 20;
        this.element.css({
            'display': 'block',
            'position': 'absolute',
            'transform': 'translate(' + dx + 'px,0px) scale(1.8)',
            'z-index': '10'
        });
        if (activateType) {
            for (var i = 0; i < this.items.length; i++) {
                $(this.items[i]).hover(
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
            this.element.attr('isDisactivate', 'false')
            this._wasActivated = true;
        }

    }

    select(): void {
        this.element.css({
            'transform': 'translate(0px,0px)',
            'z-index': '0'
        });
        for (var i = 0; i < this.items.length; i++) {
            $(this.items[i]).css({
                'transform': 'scale(1)',
            });
            $(this.items[i]).hover(
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

    }

    deactivate(): any {
        this.element.css({
            'transform': 'translate(0px,0px)',
            'z-index': '0'
        });
        for (var i = 0; i < this.items.length; i++) {
            $(this.items[i]).css({
                'transform': 'scale(1)',
            });
        }
    }

    getSrc(e) {
        return $(e.path[0]).attr('src');
    }

    isDisactivate(): string {
        return this.element.attr('isDisactivate')
    }

    wasActivated(): boolean {
        return this._wasActivated
    }

    setWasActivated(wasActivated): void {
        this._wasActivated = wasActivated
    }

    setAttribute(name: string, value: any) {
        $(this.element).attr(name, value)
    }

}
