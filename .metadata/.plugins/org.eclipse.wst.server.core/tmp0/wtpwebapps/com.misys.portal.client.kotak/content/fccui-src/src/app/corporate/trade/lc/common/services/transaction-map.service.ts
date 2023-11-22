import { Injectable } from '@angular/core';
import { TransactionDetails } from '../../../../../common/model/TransactionDetails';




@Injectable({
  providedIn: 'root'
})

export class TransactionDetailsMap {

  public transactionDetailsMap: Map<string, TransactionDetails>;

  initializeMaps(id, transactionDetails) {
  this.initialize();
  this.setMapValue(id, transactionDetails);
  }



  setMapValue(id , transactionDetails: any) {
 this.transactionDetailsMap.set(id , transactionDetails);
  }



  initialize() {
    if (this.transactionDetailsMap === undefined) {
      this.transactionDetailsMap = new Map();
    }
  }

  getTransactionDetailMap() {
    return this.transactionDetailsMap;
  }

  getSingleTransaction(id) {
    if (this.transactionDetailsMap !== undefined && this.transactionDetailsMap.has(id)) {
      return this.transactionDetailsMap.get(id);
    }
  }

}



