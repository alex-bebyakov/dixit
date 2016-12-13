import {IMessage} from "../interfaces/message";
import {User} from "./user";
import {Card} from "./card";

export class UserMessage implements IMessage {
    private _username: string;
    private _command: string;
    private _userId: string;
    private _text: string
    private _card: Card

    constructor() {
        this._username = ''
        this._command = ''
        this._userId = ''
        this._text = ''
        this._card = new Card()
    }


    set username(value: string) {
        this._username = value;
    }

    set command(value: string) {
        this._command = value;
    }

    set userId(value: string) {
        this._userId = value;
    }

    set text(value: string) {
        this._text = value;
    }

    set card(value: Card) {
        this._card = value;
    }


    get text(): string {
        return this._text;
    }
}
