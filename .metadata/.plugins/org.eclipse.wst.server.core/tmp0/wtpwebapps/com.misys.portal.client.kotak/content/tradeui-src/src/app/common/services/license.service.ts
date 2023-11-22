import { License } from '../model/license';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LicenseService {public arr: File[] = [];
  public licenseMap: License[] = [];
  constructor() { }

  pushFiles(refId: string, borefId: string, lsNumber: string, lsAllocatedAmt: string, lsAmt: string,
            lsOsAmt: string, convertedOsAmt: string, allowOverdraw: string, allowMultipleLicense: string) {
    this.licenseMap.push(new License(refId, borefId, lsNumber, lsAllocatedAmt, lsAmt, lsOsAmt,
      convertedOsAmt, allowOverdraw, allowMultipleLicense));
  }

  getlist() {
    return this.licenseMap;
   }

  get NumerOfFiles(): number {
    return this.licenseMap.length;
  }


  removeLinkedLicense() {
      this.licenseMap.length = 0;
  }
}
