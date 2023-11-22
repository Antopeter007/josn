import { Product } from './product.model';

export class Transaction extends Product {

    tnxId: string;
    tnxTypeCode: string;
    subTnxTypeCode: string;
    tnxStatCode: string;
    subTnxStatCode: string;
    boTnxId: string;
    inpUserId: string;
    releaseDttm: string;
    releaseUserId: string;
    boReleaseUserId: string;
    boReleaseDttm: string;
    inpDttm: string;
    boInpUserId: string;
    boInpDttm: string;
    tnxValDate: string;
    tnxCurCode: string;
    tnxAmt: string;
    actionReqCode: string;
    destMasterVersion: string;
    bulkTnxId: string;
    batchId: string;
}
