import {Injectable} from "@angular/core";
import {Observable, Subject} from "rxjs"
declare var io: any;

@Injectable()
export class SocketService {
    private socket: any;
    private socketIdStream: Subject<any> = new Subject<any>();
    public usersStream: Subject<any> = new Subject<any>();
    public chatMessageStream: Subject<any> = new Subject<any>();
    public userId: any;
    private username: any;
    private userExist: boolean = true;
  constructor() {
    this.socket = new io('http://localhost:5002');
      this.socketIdStream = this.createStream('socketId');
      this.usersStream = this.createStream('usersMap');
      this.chatMessageStream = this.createStream('chatMessage');
      this.socketIdStream.subscribe(data => {
          this.socket.emit('client connect', {
              username: this.username,
              socketId: data.socketId,
              connectTime: data.connectTime
          });
          this.userId = data.socketId;
      });
      this.usersStream.subscribe(data => {
          this.userExist = false;
          data.forEach(element=> {
              if (element.token === "userExist") {
                  if (element.username === this.username && element.socketId === this.userId) {
                      this.socket.disconnect();
                      this.userExist = true;
                  }
              }
          });

      });
  }

    private createStream(name: string): Subject<any> {
    return Observable.create(observer => {
      this.socket.on(name, data => {
        observer.next(data);
      });
    });
  }

    public send(name: string, data: any): void {
    this.socket.emit(name, data);
    }

    public setUsername(username: any): void {
        this.username = username;
    }

    public getUsername(): any {
        return this.username;
    }

    public isUserExist(): boolean {
        return this.userExist;
  }

}
