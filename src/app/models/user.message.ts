import {Message} from "./message";
import {User} from "./user";

export class UserMessage implements Message {

    user: User;
    command: string;
    userId: string;

    constructor() {
        this.user = new User()
        this.command = ''
        this.userId = ''
    }
}
