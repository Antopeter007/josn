import { UaTermsComponent } from './../../corporate/trade/ua/components/ua-terms/ua-terms.component';
import { UaNarrativeComponent } from './../../corporate/trade/ua/components/ua-narrative/ua-narrative.component';
import { UaPaymentDetailsComponent } from './../../corporate/trade/ua/components/ua-payment-details/ua-payment-details.component';
import { UaTypeExpiryDetailsComponent } from './../../corporate/trade/ua/components/ua-type-expiry-details/ua-type-expiry-details.component';
import { UaBankDetailsComponent } from './../../corporate/trade/ua/components/ua-bank-details/ua-bank-details.component';
import { UaIncreaseDecreaseComponent } from './../../corporate/trade/ua/components/ua-increase-decrease/ua-increase-decrease.component';
import { UaApplicantBeneficiaryComponent } from './../../corporate/trade/ua/components/ua-applicant-beneficiary/ua-applicant-beneficiary.component';
import { UaAmountChargeDetailsComponent } from './../../corporate/trade/ua/components/ua-amount-charge-details/ua-amount-charge-details.component';
import { UaContractDetailsComponent } from './../../corporate/trade/ua/components/ua-contract-details/ua-contract-details.component';
import { UaShipmentDetailsComponent } from './../../corporate/trade/ua/components/ua-shipment-details/ua-shipment-details.component';
import { UaFileUploadDetailsComponent } from './../../corporate/trade/ua/components/ua-file-upload-details/ua-file-upload-details.component';
import { UaGeneralDetailsComponent } from './../../corporate/trade/ua/components/ua-general-details/ua-general-details.component';
import { UaUndertakingDetailsComponent } from './../../corporate/trade/ua/components/ua-undertaking-details/ua-undertaking-details.component';
import { UaExtensionDetailsComponent } from './../../corporate/trade/ua/components/ua-extension-details/ua-extension-details.component';
import { UaLicenseDetailsComponent } from './../../corporate/trade/ua/components/ua-license-details/ua-license-details.component';

export class UaMapping {
  static uaWidgetMappings = {
    uaGeneralDetails : UaGeneralDetailsComponent,
    UaFileUploadDetails : UaFileUploadDetailsComponent,
    uaContractDetails: UaContractDetailsComponent,
    uaShipmentDetails: UaShipmentDetailsComponent,
    uaAmountChargeDetails: UaAmountChargeDetailsComponent,
    uaUndertakingDetails: UaUndertakingDetailsComponent,
    uaExtensionDetails: UaExtensionDetailsComponent,
    uaLicenseDetails: UaLicenseDetailsComponent,
    uaApplicantBeneficiary : UaApplicantBeneficiaryComponent,
    uaIncreaseDecreaseDetails : UaIncreaseDecreaseComponent,
    uaBankDetails : UaBankDetailsComponent,
    uaTypeAndExpiry : UaTypeExpiryDetailsComponent,
    uaPaymentDetails : UaPaymentDetailsComponent,
    uaTerms : UaTermsComponent,
    uaNarrativeDetails : UaNarrativeComponent
  };
}
