import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Session } from '../model/session.model';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({providedIn: 'root'})
  export class SessionService {
    constructor( public http: HttpClient) { }

    fetchSessionData(path: string): Observable<Session> {
      const headers = new HttpHeaders({'Content-Type': 'application/json'});
      return this.http.post<Session>(path, {headers});

    }

  }
