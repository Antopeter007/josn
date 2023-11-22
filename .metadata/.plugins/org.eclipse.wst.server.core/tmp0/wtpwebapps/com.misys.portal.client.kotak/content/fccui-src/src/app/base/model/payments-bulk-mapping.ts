import { PaymentsBulkFiletemplateDownloadComponent } from './../../corporate/cash/payments/bulk/payments-bulk-template-download/payments-bulk-filetemplate-download.component';
import { PaymentsBulkFileUploadGeneralComponent } from './../../corporate/cash/payments/bulk/payments-bulk-upload/payments-bulk-file-upload-general.component';

export class PaymentsBulkMapping {
    static paymentsBulkWidgetMappings = {
        paymentsBulkFileUploadGeneralDetail: PaymentsBulkFileUploadGeneralComponent,
        paymentsFileDownload: PaymentsBulkFiletemplateDownloadComponent
    };
}
