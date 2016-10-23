import {Injectable} from "@angular/core";
import {Observable, Subject} from "rxjs"
declare var io: any;

@Injectable()
export class SocketService {
  socket: any;

  constructor() {
    this.socket = new io('http://localhost:5002');
  }

  createStream(name: string): Subject<any> {
    return Observable.create(observer => {
      this.socket.on(name, data => {
        observer.next(data);
      });
    });
  }

  send(name: string, data: any): void {
    this.socket.emit(name, data);
  }

}
