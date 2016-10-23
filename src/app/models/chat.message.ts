
import {Message} from "./message";
export class ChatMessage implements Message{
  username: string;
  sentAt: Date;
  text: string;
  img:string;
}
