import {IMessage} from "../interfaces/message";
export class ChatMessage implements IMessage {
  username: string;
  sentAt: Date;
  text: string;
  img:string;
}
