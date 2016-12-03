import {Card} from "./card";
import {Selection} from "./selection";
export class Game {
    status: string;
    started: boolean;
    id: string;
    phase:string;
    cards:Array<Card>
    selections:Array<Selection>
}
