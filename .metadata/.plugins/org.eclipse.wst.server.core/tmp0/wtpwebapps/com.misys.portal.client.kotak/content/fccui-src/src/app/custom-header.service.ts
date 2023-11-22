import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CustomHeaderService {

  public isBurgerIconVisible = new BehaviorSubject(false);
  constructor() {
    //eslint : no-empty-function
  }

  getHeaderControl(headerData) {
    const headerLayoutClass = headerData.headerDetails.layoutClass;
    const headerStyleClass = headerData.headerDetails.styleClass;
    const headerObj = headerData.headerDetails;

    return new HeaderControl({
      ...headerObj, headerLayoutClass, headerStyleClass
    });
  }
}
// eslint-disable-next-line max-classes-per-file
class HeaderControl {
  params = {};
  constructor(params: any = {}) {
    this.params = params;
  }

}
