import { ElMT700UploadDetailsComponent } from './../../corporate/trade/el/InitiateMT700Upload/el-mt700-upload-details/el-mt700-upload-details.component';
import { ElMT700GeneralDetailsComponent } from './../../corporate/trade/el/InitiateMT700Upload/el-mt700-general-details/el-mt700-general-details.component';
import { ElFileUploadDetailsComponent } from './../../corporate/trade/el/assign/el-file-upload-details/el-file-upload-details.component';

export class ElMapping {
  static elWidgetMappings = {
    elGeneralDetails: ElMT700GeneralDetailsComponent,
    elUploadMT700: ElMT700UploadDetailsComponent,
    elFileUploadDetails: ElFileUploadDetailsComponent
  };
}
