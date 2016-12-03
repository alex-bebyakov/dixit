import {Directive, ElementRef, HostListener, EventEmitter, Input} from '@angular/core';
import {CaruselService} from "../services/carusel.service";


@Directive({
    selector: '[appCarusel]'
})
export class CaruselDirective {

    public click = new EventEmitter();

    _isActive: boolean
    _gamePhase: string
    constructor(private el: ElementRef,private caruselService:CaruselService) {
        this.caruselService.init(el);
    }

    @HostListener('click', ['$event']) onClick(e) {
        let type = e.path[1].getAttribute('type')
        if (this._isActive) {
            if (!this.caruselService.getActive()) {
                if('asking'===this._gamePhase){
                    this.caruselService.activate(true);
                }else {
                    this.caruselService.activate(false);
                }

                this.caruselService.rotate(false)
            } else {
                if ('right' === type) {
                    this.caruselService.rotate(false)
                } else if ('left' === type) {
                    this.caruselService.rotate(true)
                }
            }
        }
    }

    @Input() set isActive(isActive) {
        this._isActive = isActive
    }

    @Input() set gamePhase(phase) {
        this._gamePhase = phase || this._gamePhase
    }

}

