import { Component, OnInit, EventEmitter } from '@angular/core';
import { FCCBase } from './../../../../../base/model/fcc-base';
import { FCCMVFormControl, FCCFormGroup } from './../../../../../base/model/fcc-control.model';
import { FccGlobalConstant } from './../../../../../common/core/fcc-global-constants';
import { ProductParams } from './../../../../../common/model/params-model';
import {
  IDataEmittterModel,
  IUpdateFccBase,
} from '../../form-control-resolver/form-control-resolver.model';
import { CommonService } from './../../../../../common/services/common.service';
import { FormControlService } from './../../../../../corporate/trade/lc/initiation/services/form-control.service';
import { FccGlobalConstantService } from './../../../../../common/core/fcc-global-constant.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-three-dots-button',
  templateUrl: './three-dots-button.component.html',
  styleUrls: ['./three-dots-button.component.scss']
})
export class ThreeDotsButtonComponent extends FCCBase
implements OnInit,IUpdateFccBase {
  buttonsList = [];
  threeDotsList = [];
  threeDotsIconPath: string;

  constructor(protected commonService: CommonService,
              protected formControlService: FormControlService,
              protected fccGlobalConstantService: FccGlobalConstantService,
              protected activatedRoute: ActivatedRoute) {
    super();
  }
  controlDataEmitter: EventEmitter<IDataEmittterModel>;
  control: FCCMVFormControl;
  form: FCCFormGroup;
  nudgeData = [];

  ngOnInit(): void {
    this.threeDotsIconPath = this.fccGlobalConstantService.contextPath + '/content/FCCUI/assets/icons/threeDots.svg';
    let productCode = '';
    this.activatedRoute.params.subscribe((data) => {
      if (data) {
        productCode = data?.name;
      }
    });
    const params: ProductParams = {
      productCode: productCode,
      type: FccGlobalConstant.MODEL_FORM
    };
    this.commonService.getProductModel(params).subscribe((res) => {
      if (res?.Buttons) {
        const buttons = res?.Buttons;
        this.form = this.formControlService.getFormControls(buttons);
        res?.Buttons?.forEach((button, i) => {
          if(i < 2) {
            this.buttonsList.push(button);
          } else {
            this.threeDotsList.push(button);
          }
        });
      }
    });
  }
}
