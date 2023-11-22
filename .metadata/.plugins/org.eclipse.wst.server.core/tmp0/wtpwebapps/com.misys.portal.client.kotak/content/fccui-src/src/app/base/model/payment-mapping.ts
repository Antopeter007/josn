import { BatchGeneralDetailsComponent } from './../../corporate/cash/payments/single/batch/batch-general-details/batch-general-details.component';
import { InstrumentGeneralDetailsComponent } from './../../corporate/cash/payments/single/instrument/instrument-general-details/instrument-general-details.component';
export class PaymentMapping {
  static paymentWidgetMappings = {
    instrumentGeneralDetails : InstrumentGeneralDetailsComponent,
    batchGeneralDetails : BatchGeneralDetailsComponent

  };
}
