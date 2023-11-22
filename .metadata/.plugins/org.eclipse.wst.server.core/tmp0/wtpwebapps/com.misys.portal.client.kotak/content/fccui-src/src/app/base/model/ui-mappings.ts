import { UiIncreaseDecreaseComponent } from '../../corporate/trade/ui/initiation/component/ui-increase-decrease/ui-increase-decrease.component';
import { UiGeneralDetailsComponent } from '../../corporate/trade/ui/initiation/component/ui-general-details/ui-general-details.component';
import { UiMTBGeneralDetailsComponent } from '../../corporate/trade/ui/messageotobank/component/ui-general-details/ui-mtb-general-details.component';
import { UiTypeExpiryDetailsComponent } from '../../corporate/trade/ui/initiation/component/ui-type-expiry-details/ui-type-expiry-details.component';
import { UiAmountChargeDetailsComponent } from '../../corporate/trade/ui/initiation/component/ui-amount-charge-details/ui-amount-charge-details.component';
import { UiExtensionDetailsComponent } from '../../corporate/trade/ui/initiation/component/ui-extension-details/ui-extension-details.component';
import { UiBankDetailsComponent } from '../../corporate/trade/ui/initiation/component/ui-bank-details/ui-bank-details.component';
import { UiInstructionsForBankComponent } from '../../corporate/trade/ui/initiation/component/ui-instructions-for-bank/ui-instructions-for-bank.component';
import { UiIrregularIncreaseDecreaseDialogComponent } from '../../corporate/trade/ui/initiation/component/ui-irregular-increase-decrease-dialog/ui-irregular-increase-decrease-dialog';
import { UiTermsComponent } from '../../corporate/trade/ui/initiation/component/ui-terms/ui-terms.component';
import { UiContractDetailsComponent } from '../../corporate/trade/ui/initiation/component/ui-contract-details/ui-contract-details.component';
import { UiNarrativeComponent } from '../../corporate/trade/ui/initiation/component/ui-narrative/ui-narrative.component';
import { UiLicenseDetailsComponent } from '../../corporate/trade/ui/initiation/component/ui-license-details/ui-license-details.component';
import { UiApplicantBeneficiaryComponent } from './../../corporate/trade/ui/initiation/component/ui-applicant-beneficiary/ui-applicant-beneficiary.component';
import { UiFileUploadDetailsComponent } from './../../corporate/trade/ui/initiation/component/ui-file-upload-details/ui-file-upload-details.component';
import { UiPaymentDetailsComponent } from '../../corporate/trade/ui/initiation/component/ui-payment-details/ui-payment-details.component';
import { UiShipmentDetailsComponent } from '../../corporate/trade/ui/initiation/component/ui-shipment-details/ui-shipment-details.component';
import { UiCuAmountChargeDetailsComponent } from '../../corporate/trade/ui/initiation/component/ui-cu-amount-charge-details/ui-cu-amount-charge-details.component';
import { UiCuGeneralDetailsComponent } from '../../corporate/trade/ui/initiation/component/ui-cu-general-details/ui-cu-general-details.component';
import { UiCuExtensionDetailsComponent } from '../../corporate/trade/ui/initiation/component/ui-cu-extension-details/ui-cu-extension-details.component';
import { UiCuBeneficiaryDetailsComponent } from '../../corporate/trade/ui/initiation/component/ui-cu-beneficiary-details/ui-cu-beneficiary-details.component';
import { UiCuIncreaseDecreaseComponent } from '../../corporate/trade/ui/initiation/component/ui-cu-increase-decrease/ui-cu-increase-decrease.component';
import { UiCuIrregularIncreaseDecreaseComponent } from '../../corporate/trade/ui/initiation/component/ui-cu-irregular-increase-decrease-dialog/ui-cu-irregular-increase-decrease-dialog';
import { UiCuUndertakingDetailsComponent } from '../../corporate/trade/ui/initiation/component/ui-cu-undertaking-details/ui-cu-undertaking-details.component';
import { UiCuPaymentDetailsComponent } from '../../corporate/trade/ui/initiation/component/ui-cu-payment-details/ui-cu-payment-details.component';
import { UiAdviseThroughBankComponent } from '../../corporate/trade/ui/initiation/component/ui-advise-through-bank/ui-advise-through-bank.component';
import { UiLocalAdviseThroughBankComponent } from '../../corporate/trade/ui/initiation/component/ui-local-advise-through-bank/ui-local-advise-through-bank.component';
import { UiAdvisingBankComponent } from '../../corporate/trade/ui/initiation/component/ui-advising-bank/ui-advising-bank.component';
import { UiConfirmingBankComponent } from '../../corporate/trade/ui/initiation/component/ui-confirming-bank/ui-confirming-bank.component';
import { UiIssuingBankComponent } from '../../corporate/trade/ui/initiation/component/ui-issuing-bank/ui-issuing-bank.component';
import { UiUndertakingDetailsComponent } from '../../corporate/trade/ui/initiation/component/ui-undertaking-details/ui-undertaking-details.component';
import { UiCounterSectionDetailsComponent } from '../../corporate/trade/ui/initiation/component/ui-counter-section-details/ui-counter-section-details.component';
import { UiCuNarrativeComponent } from '../../corporate/trade/ui/initiation/component/ui-cu-narrative/ui-cu-narrative.components';


export class UiMapping {
  static uiWidgetMappings = {
    uiGeneralDetails: UiGeneralDetailsComponent,
    uiTransactionBrief : UiMTBGeneralDetailsComponent,
    uiUndertakingDetails: UiUndertakingDetailsComponent,
    uiTypeAndExpiry: UiTypeExpiryDetailsComponent,
    uiAmountChargeDetails: UiAmountChargeDetailsComponent,
    uiExtensionDetails: UiExtensionDetailsComponent,
    uiBankDetails: UiBankDetailsComponent,
    uiBankInstructions: UiInstructionsForBankComponent,
    uiIncreaseDecreaseDetails: UiIncreaseDecreaseComponent,
    uiIrregularIncreaseDecreaseDialog: UiIrregularIncreaseDecreaseDialogComponent,
    uiPaymentDetails: UiPaymentDetailsComponent,
    uiShipmentDetails: UiShipmentDetailsComponent,
    uiTerms: UiTermsComponent,
    uiContractDetails: UiContractDetailsComponent,
    uiNarrativeDetails: UiNarrativeComponent,
    uiApplicantBeneficiaryDetails: UiApplicantBeneficiaryComponent,
    uiLicenseDetails: UiLicenseDetailsComponent,
    uiFileUploadDetails: UiFileUploadDetailsComponent,
    uiCuCounterDetails: UiCounterSectionDetailsComponent,
    uiCuAmountChargeDetails: UiCuAmountChargeDetailsComponent,
    uiCuGeneralDetails: UiCuGeneralDetailsComponent,
    uiCuBeneficiaryDetails: UiCuBeneficiaryDetailsComponent,
    uiCuExtensionDetails: UiCuExtensionDetailsComponent,
    uiCuIncreaseDecreaseDetails: UiCuIncreaseDecreaseComponent,
    uiCuIrregularIncreaseDecreaseDialog: UiCuIrregularIncreaseDecreaseComponent,
    uiCuPaymentDetails: UiCuPaymentDetailsComponent,
    uiCuUndertakingDetails: UiCuUndertakingDetailsComponent,
  	uiIssuingBank : UiIssuingBankComponent,
    uiAdvisingBank : UiAdvisingBankComponent,
    uiAdviceThrough : UiAdviseThroughBankComponent,
    uiLocalAdviseThrough : UiLocalAdviseThroughBankComponent,
    uiConfirmingBank : UiConfirmingBankComponent,
    uiCuNarrativeDetails : UiCuNarrativeComponent
  };
}
