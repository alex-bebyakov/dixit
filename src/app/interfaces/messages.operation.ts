import {IMessage} from "./message";

export interface IMessagesOperation extends Function {
    (messages: IMessage[]): IMessage[];
}
