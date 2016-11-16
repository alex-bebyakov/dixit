import {Message} from "./message";
import {User} from "./user";

export class UserMessage implements Message {
    user: User;
    text: string;
}
