import { BeneficiaryGeneralDetailComponent } from '../../corporate/system-features/beneficiary-maintenance/beneficiary-general-detail/beneficiary-general-detail.component';
import { FCMBeneficiaryGeneralDetailsComponent } from '../../corporate/system-features/fcm-beneficiary-maintenance/fcm-beneficiary-general-details/fcm-beneficiary-general-details.component';

export class BeneficiaryMapping {
  static beneficiaryWidgetMappings = {
    beneficiaryGeneralDetail : BeneficiaryGeneralDetailComponent,
    fcmBeneficiaryGeneralDetails : FCMBeneficiaryGeneralDetailsComponent
  };
}
