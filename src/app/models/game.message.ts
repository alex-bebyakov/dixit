import {Message} from "./message";

export class GameMessage implements Message {
    status: string;
    ini: boolean;
    players: any;
    id: string;
}
