import {Message} from "./message";
import {Player} from "./player";
import {Game} from "./game";
import {UserMessage} from "./user.message";

export class GameMessage implements Message {
    game: Game;
    player: Player;
    text: string;

}
