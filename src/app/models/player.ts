import {Card} from "./card";
export class Player {
    name: string;
    active: boolean;
    handActive: boolean;
    tableActive: boolean;
    no: number;
    score: number;
    cards: Array<Card>;
    status: string;

    constructor() {
        this.name = '';
        this.active = false;
        this.handActive = false;
        this.tableActive = false;
        this.no = 0;
        this.score = 0;
        this.status = '';
    }
}
