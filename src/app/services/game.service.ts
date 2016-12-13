import {Injectable} from "@angular/core";
import {GameMessage} from "../models/game.message";
import {Game} from "../models/game";
import {Player} from "../models/player";
@Injectable()
export class GameService {

    private game: Game
    private player: Player

    constructor() {
        this.game = new Game()
        this.player = new Player()
    }

    update(message: GameMessage) {
        this.game = message.game;
        this.player = message.player
    }

    getGame() {
        return this.game
    }

    getPlayer() {
        return this.player
    }

}
