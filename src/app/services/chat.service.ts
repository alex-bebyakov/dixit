import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import {Subject,  Observable }     from 'rxjs';


@Injectable()
export class ChatService {
  updates: Subject<any> = new Subject<any>();
  constructor(private http: Http) {

  }

}
