import {Card} from "./card";
import {Selection} from "./selection";
export class Game {
    status: string;
    started: boolean;
    id: string;
    phase: string;
    cards: Array<Card>
    selections: Array<Selection>
    scores: Array<number>
    roundScores: Array<number>
    playersNames: Array<string>

    constructor() {
        this.status = 'starting';
        this.started = false;
        this.id = '';
        this.phase = 'asking';
        this.scores = [0]

    }
}
