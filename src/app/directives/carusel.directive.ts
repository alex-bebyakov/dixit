import {Directive, ElementRef, HostListener, EventEmitter, Input} from '@angular/core';
import {CaruselService} from "../services/carusel.service";

@Directive({
    selector: '[appCarusel]'
})
export class CaruselDirective {

    public click = new EventEmitter();
    _isActive: boolean
    _activationStatus: boolean

    constructor(private el: ElementRef, private caruselService: CaruselService) {
        this.caruselService.initialize(el, ['divImgClass', 'divArrowClass', 'askInputClass', 'answerInputClass', 'shift_X', 'shift_Y', 'perspective', 'radius']);
    }

    @HostListener('click', ['$event']) onClick(event) {

        let type =  this.caruselService.getType(event)

        if (this._isActive) {
            if (!this.caruselService.isActive()) {
                this.caruselService.activate(this._activationStatus);
                this.caruselService.animate(false)
            } else {
                if ('right' === type) {
                    this.caruselService.animate(false)
                } else if ('left' === type) {
                    this.caruselService.animate(true)
                }
            }
        }
    }

    @Input() set isActive(isActive) {
        this._isActive = isActive
    }

    @Input() set playerStatus(playerStatus) {
        this._activationStatus = playerStatus == 'asker' ? true : false;
    }



}

