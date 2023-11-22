import { Injectable } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { FCCFormGroup } from "../../../../../../base/model/fcc-control.model";
import { FccGlobalConstant } from "../../../../../../common/core/fcc-global-constants";
import { CommonService } from "../../../../../../common/services/common.service";
import { EventEmitterService } from "../../../../../../common/services/event-emitter-service";
import { ProductValidator } from "../../../../../common/validator/productValidator";
import { ProductStateService } from "../../../../lc/common/services/product-state.service";

@Injectable({
  providedIn: "root",
})
export class FtTradeProductService implements ProductValidator {
  constructor(
    protected eventEmitterService: EventEmitterService,
    protected productStateService: ProductStateService,
    protected commonService: CommonService,
    protected translateService: TranslateService
  ) {}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
  beforeSaveValidation(form?: any): boolean {
    const sectionForm : FCCFormGroup= this.productStateService.getSectionData(
      "ftTradeGeneralDetails",
      FccGlobalConstant.PRODUCT_FT
    );
    const option = this.commonService.getQueryParametersFromKey("option");
    this.renderBankFileds(sectionForm);
    if (sectionForm.get("transferTypeOptions")) {
      const transferTypeVal = sectionForm.get("transferTypeOptions").value;
      const val = sectionForm.get("transferTypeOptions")[
        FccGlobalConstant.PARAMS
      ][FccGlobalConstant.OPTIONS];
      if (option !== FccGlobalConstant.TEMPLATE) {
        this.toggleCreateFormButtons(val, transferTypeVal);
      }
    }
    return true;
  }
  beforeSubmitValidation(): boolean {
    const isValid = this.validate();
    this.eventEmitterService.subFlag.next(isValid);
    return true;
  }

  validate() {
    return true;
  }

  toggleCreateFormButtons(val, transferTypeVal) {
    val.forEach((element) => {
      if (transferTypeVal !== element.value) {
        element[FccGlobalConstant.DISABLED] = true;
      } else {
        element[FccGlobalConstant.DISABLED] = false;
      }
    });
  }
  renderBankFileds(sectionForm: any) {
    const accountbankFields = [
      "accountWithBank",
      "advisingswiftCode",
      "advisingBankIcons",
      "advisingBankName",
      "advisingBankFirstAddress",
      "advisingBankSecondAddress",
      "advisingBankThirdAddress",
      "payThroughBank",
      "advThroughswiftCode",
      "advThroughBankIcons",
      "adviceThroughName",
      "adviceThroughFirstAddress",
      "adviceThroughSecondAddress",
      "adviceThroughThirdAddress",
    ];
    this.toggleControls(sectionForm, accountbankFields, true);
  }

  toggleControls(form, ids: string[], flag) {
    ids.forEach((id) => this.toggleControl(form, id, flag));
  }
  toggleControl(form, id, flag) {
    form.controls[id].params.rendered = flag;
  }
}
