import {Message} from "./message";

export class MasterMessage implements Message {
    text: string;

    constructor() {
        this.text = ''
    }
}
