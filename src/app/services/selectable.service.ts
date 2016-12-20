import {Injectable, ElementRef} from "@angular/core";

declare var $: any;

@Injectable()
export class SelectableService {
    private element: any
    private items: any;
    private _wasActivated = false
    private dx:number=0
    constructor() {
    }

    init(el: ElementRef) {
        this.element = $(el.nativeElement).find('.table-root')
        this.items = $(this.element).children('.table-card')
        if(this.dx==0){
            this.dx=$(this.items[0]).width()*this.items.length*0.5
        }
        console.log(this.items)
    }

    update(el: ElementRef) {
        this.element = $(el.nativeElement);
        this.items = $(this.element).children('.table-card')
    }

    activate(activateType): any {
        this.element.css({
            'display': 'block',
            'position': 'absolute',
            'transform': 'translate(' + this.dx + 'px,0px) scale(1.8)',
            'z-index': '10'
        });
        if (!activateType) {
            this.element.attr('isDisactivate', 'false')
            this.dx=0
        }
        this._wasActivated = true;
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

    getSrc(event) {
        return $(event.target).attr('src');
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
