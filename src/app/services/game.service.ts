import {Injectable} from "@angular/core";
import {Http, Response} from "@angular/http";
import {Observable} from "rxjs";
import "rxjs/add/operator/map";
import {Utils} from "../utils";


@Injectable()
export class GameService {

    constructor(private http: Http) {

    }

    getStatus(): Observable<boolean> {
        return this.http.get('/api/game/status').map((response: Response) => {
            return Utils.httpResponse(response);
        });

    }

    getId(): Observable<boolean> {
        return this.http.get('/api/game/id').map((response: Response) => {
            return Utils.httpResponse(response);
        });
    }
}
