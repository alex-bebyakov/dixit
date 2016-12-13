import {IMessage} from "../interfaces/message";

export class MasterMessage implements IMessage {
    text: string;

    constructor() {
        this.text = ''
    }
}
