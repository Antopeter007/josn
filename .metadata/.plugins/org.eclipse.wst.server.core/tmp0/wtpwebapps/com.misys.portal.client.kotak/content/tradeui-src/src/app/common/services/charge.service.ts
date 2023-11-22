import { Charge } from '../model/charge.model';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ChargeService {

  public chargeList: Charge[] = [];
  constructor() { }

  addCharges(charge) {
    this.chargeList.push(charge);
  }

  updateCharges(charge) {
    for (let i = 0; i < this.chargeList.length; ++i) {
      if (this.chargeList[i].chargeId === charge.chargeId) {
          this.chargeList.splice(i, 1);
      }
    }
    this.chargeList.push(charge);
  }

  getCharges() {
    return this.chargeList;
  }
}
