import {IMessage} from "../interfaces/message";
import {Player} from "./player";
import {Game} from "./game";

export class GameMessage implements IMessage {
    game: Game;
    player: Player;

    constructor() {
        this.game = new Game();
        this.player = new Player();
    }
}
