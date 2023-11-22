import { BeneBulkFiletemplateDownloadComponent } from "../../../app/corporate/system-features/beneficiary-maintenance/bene-bulk-filetemplate-download/bene-bulk-filetemplate-download.component";
import { BeneBulkFileUploadGeneralComponent } from "../../../app/corporate/system-features/beneficiary-maintenance/bene-bulk-file-upload-general/bene-bulk-file-upload-general.component";

export class BeneBulkMapping {
    static beneBulkWidgetMappings = {
        beneBulkFileUploadGeneralDetail : BeneBulkFileUploadGeneralComponent,
        beneFileDownload : BeneBulkFiletemplateDownloadComponent
      };
}
