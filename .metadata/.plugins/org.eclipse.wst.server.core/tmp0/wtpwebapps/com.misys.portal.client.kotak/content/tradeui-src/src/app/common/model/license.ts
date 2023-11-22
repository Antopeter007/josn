export class License {
  constructor(
      public lsRefId: string,
      public boRefId: string,
      public lsNumber: string,
      public lsAllocatedAmt: string,
      public lsAmt: string,
      public lsOsAmt: string,
      public convertedOsAmt: string,
      public allowOverdraw: string,
      public allowMultipleLicense: string
 ) {}
}
