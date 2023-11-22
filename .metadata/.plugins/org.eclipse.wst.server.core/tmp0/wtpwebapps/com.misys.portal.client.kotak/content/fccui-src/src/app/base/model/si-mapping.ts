import { SiAdviseThroughBankComponent } from './../../corporate/trade/si/initiation/component/si-advise-through-bank/si-advise-through-bank.component';
import { SiAdvisingBankComponent } from './../../corporate/trade/si/initiation/component/si-advising-bank/si-advising-bank.component';
import { SiAmountChargeDetailsComponent } from './../../corporate/trade/si/initiation/component/si-amount-charge-details/si-amount-charge-details.component';
import { SiApplicantBeneficiaryDetailsComponent } from './../../corporate/trade/si/initiation/component/si-applicant-beneficiary-details/si-applicant-beneficiary-details.component';
import { SiBankDetailsComponent } from './../../corporate/trade/si/initiation/component/si-bank-details/si-bank-details.component';
import { SiConfirmationPartyComponent } from './../../corporate/trade/si/initiation/component/si-confirmation-party/si-confirmation-party.component';
import { SiGeneralDetailsComponent } from './../../corporate/trade/si/initiation/component/si-general-details/si-general-details.component';
import { SiInstructionsToBankDetailsComponent } from './../../corporate/trade/si/initiation/component/si-instructions-to-bank-details/si-instructions-to-bank-details.component';
import { SiIssuingBankComponent } from './../../corporate/trade/si/initiation/component/si-issuing-bank/si-issuing-bank.component';
import { SiPaymentDetailsComponent } from './../../corporate/trade/si/initiation/component/si-payment-details/si-payment-details.component';
import { SiRenewalDetailsComponent } from './../../corporate/trade/si/initiation/component/si-renewal-details/si-renewal-details.component';
import { SiShipmentDetailsComponent } from './../../corporate/trade/si/initiation/component/si-shipment-details/si-shipment-details.component';
import { SiFileUploadDetailsComponent } from './../../corporate/trade/si/initiation/component/si-file-upload-details/si-file-upload-details.component';
import { SiMessageToBankGeneralDetailsComponent } from "./../../corporate/trade/si/messagetobank/component/si-message-to-bank-general-details/si-message-to-bank-general-details.component";
import { SiGoodsAndDocumentsComponent } from './../../corporate/trade/si/initiation/component/si-goods-and-documents/si-goods-and-documents.component';
import { SiOtherDetailsComponent } from './../../corporate/trade/si/initiation/component/si-other-details/si-other-details.component';
import { SiDescriptionOfGoodsComponent } from './../../corporate/trade/si/initiation/component/si-description-of-goods/si-description-of-goods.component';
import { SiDocumentsRequiredComponent } from './../../corporate/trade/si/initiation/component/si-documents-required/si-documents-required.component';
import { SiAdditionalInstructionsComponent } from './../../corporate/trade/si/initiation/component/si-additional-instructions/si-additional-instructions.component';
import { SiNarrativeDetailsComponent } from './../../corporate/trade/si/initiation/component/si-narrative-details/si-narrative-details.component';
import { SiSpecialPaymentForBeneficiaryComponent } from './../../corporate/trade/si/initiation/component/si-special-payment-for-beneficiary/si-special-payment-for-beneficiary.component';
import { SiPeriodOfPresentationComponent } from './../../corporate/trade/si/initiation/component/si-period-of-presentation/si-period-of-presentation.component';
import { SiAmendReleaseGeneralDetailsComponent } from './../../corporate/trade/si/amendrelease/component/si-amend-release-general-details/si-amend-release-general-details.component';

export class SiMapping {
  static siWidgetMappings = {
    siMessageToBankGeneralDetails: SiMessageToBankGeneralDetailsComponent,
    siFileUploadDetails: SiFileUploadDetailsComponent,
    siGeneralDetails : SiGeneralDetailsComponent,
    siApplicantBeneficiaryDetails : SiApplicantBeneficiaryDetailsComponent,
    siAmountChargeDetails : SiAmountChargeDetailsComponent,
    siPaymentDetails : SiPaymentDetailsComponent,
    siShipmentDetails : SiShipmentDetailsComponent,
    siRenewalDetails : SiRenewalDetailsComponent,
    siInstructionToBank : SiInstructionsToBankDetailsComponent,
    siBankDetails : SiBankDetailsComponent,
    siIssuingBank : SiIssuingBankComponent,
    siAdviseThroughBank : SiAdviseThroughBankComponent,
    siAdvisingBank : SiAdvisingBankComponent,
    siConfirmationParty : SiConfirmationPartyComponent,
    siGoodsandDoc : SiGoodsAndDocumentsComponent,
    siOtherDetails : SiOtherDetailsComponent,
    siDescOfGoods : SiDescriptionOfGoodsComponent,
    siDocRequired : SiDocumentsRequiredComponent,
    siAdditionallnstruction : SiAdditionalInstructionsComponent,
    siNarrativeDetails : SiNarrativeDetailsComponent,
    siSpecialPaymentNarrativeBene : SiSpecialPaymentForBeneficiaryComponent,
    siPeriodOfPresentation : SiPeriodOfPresentationComponent,
	  siAmendReleaseGeneralDetails : SiAmendReleaseGeneralDetailsComponent	 
  };
}
