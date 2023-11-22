import { BkGeneralDetailsComponent } from '../../corporate/cash/bk/bulkServices/initiation/bk-general-details/bk-general-details.component';
import { TptGeneralDetailsComponent } from '../../corporate/cash/fund transfer/ft/tpt/tpt-general-details/tpt-general-details.component';

export class FtCashMapping {
  static ftCashWidgetMappings = {
    tptGeneralDetails : TptGeneralDetailsComponent,
    bkGeneralDetails: BkGeneralDetailsComponent
  };
}
