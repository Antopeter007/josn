import { SrAssignmentConditionsComponent } from "../../corporate/trade/sr/assignment/sr-assignment-conditions/sr-assignment-conditions.component";
import { SrFileUploadDetailsComponent } from "../../corporate/trade/sr/sr-file-upload-details/sr-file-upload-details.component";
import { SrGeneralDetailsComponent } from "../../corporate/trade/sr/sr-general-details/sr-general-details.component";
import { SrDeliveryInstructionsComponent } from "../../corporate/trade/sr/transfer/sr-delivery-instructions/sr-delivery-instructions.component";
import { SrTransferConditionsComponent } from "../../corporate/trade/sr/transfer/sr-transfer-conditions/sr-transfer-conditions.component";


export class SrMapping {
  static srWidgetMappings = {
    srFileUploadDetails: SrFileUploadDetailsComponent,
    srGeneralDetails : SrGeneralDetailsComponent,
    srDeliveryInstructions: SrDeliveryInstructionsComponent,
    srTransferConditions: SrTransferConditionsComponent,
    srAssignmentConditions: SrAssignmentConditionsComponent
  };
}
