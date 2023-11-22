import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class RetrieveCredentialsService {

  constructor() {
    //eslint : no-empty-function
  }

  responseMessage: string;
  responseHeader: string;

  public setResponseMessage(message: string) {
    this.responseMessage = message;
  }

  public getResponseMessage() {
    return this.responseMessage;
  }

  public setResponseHeader(header: string) {
    this.responseHeader = header;
  }

  public getResponseHeader() {
    return this.responseHeader;
  }
}
