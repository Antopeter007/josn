import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ResponseService {

  response: string;

  constructor() {
    //eslint : no-empty-function
  }

  setResponseMessage(message: string) {
    this.response = message;
  }

  getResponseMessage() {
    return this.response;
  }

}
