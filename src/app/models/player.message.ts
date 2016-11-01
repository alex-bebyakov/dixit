import {Message} from "./message";
import {Player} from "./player";

export class PlayerMessage implements Message {
    player: Player;
    text: string;
}
