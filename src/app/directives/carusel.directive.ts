import {Directive, ElementRef, HostListener, EventEmitter, Input} from '@angular/core';
import {CaruselService} from "../services/carusel.service";


@Directive({
    selector: '[appCarusel]'
})
export class CaruselDirective {
    private caruselService: CaruselService;
    private isActive: boolean = false;
    public click = new EventEmitter();
    _playerActive: boolean
    constructor(el: ElementRef) {
        this.caruselService = new CaruselService(el, ['divImgClass', 'divArrowClass', 'shift_X', 'shift_Y', 'perspective', 'radius'])
    }

    @HostListener('click', ['$event']) onClick(e) {
        let type = e.path[1].getAttribute('type')
        if (this._playerActive) {
            if (!this.isActive) {
                this.isActive = true;
                this.caruselService.activate()
                this.caruselService.rotate(false)
            } else {
                if ('right' === type) {
                    this.caruselService.rotate(false)
                } else if ('left' === type) {
                    this.caruselService.rotate(true)
                } else {
                    this.caruselService.deactivate()
                    this.isActive = false;
                }
            }
        }
        e.preventDefault()

    }

    @Input() set playerActive(isActive) {
        this._playerActive = isActive || this._playerActive
    }



}

