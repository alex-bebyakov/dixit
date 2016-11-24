import {Card} from "./card";
export class Player {
    name: string;
    active: boolean;
    handActive: boolean;
    tableActive: boolean;
    no: number;
    score: number;
    cards: Array<Card>;
}
