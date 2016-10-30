import {Injectable} from "@angular/core";
import {Observable, Subject} from "rxjs"
import {Player} from "../models/player";
declare var io: any;

@Injectable()
export class SocketService {
    private socket: any;
    public players: Observable<Array<Player>>;
    private socketIdStream: Subject<any> = new Subject<any>();
    private usersStream: Subject<any> = new Subject<any>();
    public chatMessageStream: Subject<any> = new Subject<any>();
    public userId: any;
    public socketIni: boolean = false;
    private username: any;
    private userExist: boolean = true;
    private toManyUsers: boolean = false;
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

      this.players = this.usersStream.map(data => {
          this.userExist = false;
          if (!this.socketIni) {
              this.socketIni = true;
          }

          let players: Array<Player> = new Array<Player>();
          data.forEach(element=> {
              let p: Player = new Player();
              p.username = element.username;
              p.avatarImg = element.avatarImg;
              p.isUser = (element.socketId === this.userId);
              if (element.username === this.username && element.socketId === this.userId) {
                  if (element.token === "userExist") {
                      this.userExist = true;
                  }
                  if (element.token === "toManyUsers") {
                      this.toManyUsers = true;
                  }
                  if (this.userExist || this.toManyUsers) {
                      this.socket.disconnect();
                  } else {
                      players.push(p)
                  }
              } else {
                  if (!(element.token === "userExist" || element.token === "toManyUsers")) {
                      players.push(p)
                  }

              }
          });
          return players;

      }).publishReplay(1).refCount();
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

    public isToManyUsers(): boolean {
        return this.toManyUsers;
    }

}
