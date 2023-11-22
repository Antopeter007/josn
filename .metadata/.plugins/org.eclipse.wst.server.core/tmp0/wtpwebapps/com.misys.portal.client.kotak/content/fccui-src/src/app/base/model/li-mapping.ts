import { LiMtbFileUploadDialogComponent } from './../../corporate/trade/li/MessageToBank/li-mtb-file-upload-dialog/li-mtb-file-upload-dialog.component';
import { LiMtbFileUploadDetailsComponent } from './../../corporate/trade/li/MessageToBank/li-mtb-file-upload-details/li-mtb-file-upload-details.component';
import { LiMessageToBankGeneralDetailsComponent } from './../../corporate/trade/li/MessageToBank/li-message-to-bank-general-details/li-message-to-bank-general-details.component';

import { LiFileUploadDetailsComponent } from './../../corporate/trade/li/initiation/li-file-upload-details/li-file-upload-details.component';
import { LiIssuingBankAndAmountComponent } from './../../corporate/trade/li/initiation/li-issuing-bank-and-amount/li-issuing-bank-and-amount.component';
import { LiInstructionsToBankComponent } from './../../corporate/trade/li/initiation/li-instructions-to-bank/li-instructions-to-bank.component';
import { LiApplicantBeneficiaryComponent } from './../../corporate/trade/li/initiation/li-applicant-beneficiary/li-applicant-beneficiary.component';
import { LiGeneralDetailsComponent } from './../../corporate/trade/li/initiation/li-general-details/li-general-details.component';

export class LiMapping {
  static liWidgetMappings = {
    liGeneralDetails: LiGeneralDetailsComponent,
    liApplicantBeneficiary: LiApplicantBeneficiaryComponent,
    liInstructionsToBank: LiInstructionsToBankComponent,
    liIssuingBankAndAmount: LiIssuingBankAndAmountComponent,
    liFileUploadDetails: LiFileUploadDetailsComponent,
    liMtbFileUploadDialog: LiMtbFileUploadDialogComponent,
    liMtbFileUploadDetails: LiMtbFileUploadDetailsComponent,
    liMessageToBankGeneralDetails: LiMessageToBankGeneralDetailsComponent
  };
}
