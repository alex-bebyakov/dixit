import {Component, OnInit, Input} from '@angular/core';
import {UserMessage} from "../../../../models/user.message";

@Component({
    selector: 'table',
    templateUrl: './table.component.html',
    styleUrls: ['./table.component.scss']
})
export class TableComponent implements OnInit {
    @Input() message: UserMessage

    constructor() {

    }

    ngOnInit() {

    }
}
