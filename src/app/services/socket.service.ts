import {Injectable} from "@angular/core";
import {Observable, Subject} from "rxjs"
import {User} from "../models/user";
declare var io: any;
declare var expressPort:any
@Injectable()
export class SocketService {
    private socket: any;
    public users: Observable<Array<User>>;
    private socketIdStream: Subject<any> = new Subject<any>();
    private usersStream: Subject<any> = new Subject<any>();
    public chatMessageStream: Subject<any> = new Subject<any>();
    public masterMessageStream: Subject<any> = new Subject<any>();
    public playerMessageStream: Subject<any> = new Subject<any>();
    public tableMessageStream: Subject<any> = new Subject<any>();
    public userId: any;
    public socketIni: boolean = false;
    private userExist: boolean = true;
    private toManyUsers: boolean = false;
    private gameBegan: boolean = false;

    constructor(private username: string) {
        this.socket = new io('http://dixit-mean.herokuapp.com:'+expressPort.toString());
        console.log(expressPort)
        this.socketIdStream = this.createStream('socketId');
        this.usersStream = this.createStream('usersMap');
        this.chatMessageStream = this.createStream('chatMessage');
        this.masterMessageStream = this.createStream('masterMessage_'.concat(username));
        this.playerMessageStream = this.createStream('playerMessage_'.concat(username));
        this.tableMessageStream = this.createStream('tableMessage_'.concat(username));
        this.socketIdStream.subscribe(data => {
            this.socket.emit('app connect', {
                username: this.username,
                socketId: data.socketId,
                connectTime: data.connectTime
            });
            this.userId = data.socketId;
        });
        this.users = this.usersStream.map(data => {
            this.userExist = false;
            if (!this.socketIni) {
                this.socketIni = true;
            }
            let users: Array<User> = new Array<User>();
            data.forEach(element=> {
                let u: User = new User();
                u.username = element.username;
                u.avatarImg = element.avatarImg;
                u.isUser = (element.socketId === this.userId);
                u.color = element.color;
                u.no = element.no;
                if (element.username === this.username && element.socketId === this.userId) {
                    if (element.token === "userExist") {
                        this.userExist = true;
                    }
                    if (element.token === "toManyUsers") {
                        this.toManyUsers = true;
                    }
                    if (element.token === "gameBegan") {
                        this.gameBegan = true;
                    }
                    if (this.userExist || this.toManyUsers || this.gameBegan) {
                        this.socket.disconnect();
                    } else {
                        users.push(u)
                    }
                } else {
                    if (!(element.token === "userExist" || element.token === "toManyUsers")) {
                        users.push(u)
                    }
                }
            });
            return users;

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

    public getUsername(): any {
        return this.username;
    }

    public isUserExist(): boolean {
        return this.userExist;
    }

    public isToManyUsers(): boolean {
        return this.toManyUsers;
    }

    public isGameBegan(): boolean {
        return this.gameBegan;
    }

}
