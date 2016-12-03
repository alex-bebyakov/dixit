import {Message} from "./message";
import {User} from "./user";
import {Card} from "./card";

export class UserMessage implements Message {

    user: User;
    command: string;
    userId: string;
    text:string
    card:Card

    constructor() {
        this.user = new User()
        this.command = ''
        this.userId = ''
        this.text=''
        this.card=new Card()
    }
}
