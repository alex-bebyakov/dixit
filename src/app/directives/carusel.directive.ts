import {Directive, ElementRef, Input, HostListener, EventEmitter} from '@angular/core';
import {CaruselService} from "../services/carusel.service";

@Directive({
    selector: '[appCarusel]'
})
export class CaruselDirective {
    private caruselService: CaruselService;
    private isActive: boolean = false;
    public click = new EventEmitter();

    constructor(el: ElementRef) {
        this.caruselService = new CaruselService(el, ['imgClass', 'shift_X', 'shift_Y', 'perspective', 'radius'])
    }

    @HostListener('click', ['$event.target']) onClick(e) {
        if (!this.isActive) {
            this.isActive = true;
            this.caruselService.activate()
            this.caruselService.rotate(false)
        } else {
            this.caruselService.rotate(true)
        }
    }

}
