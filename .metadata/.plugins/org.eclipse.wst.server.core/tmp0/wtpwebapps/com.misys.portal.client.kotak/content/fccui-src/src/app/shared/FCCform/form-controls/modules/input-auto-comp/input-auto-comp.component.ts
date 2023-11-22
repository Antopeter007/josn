import {
  AfterViewInit,
  Component,
  EventEmitter,
  Output,
  Input,
  OnInit,
} from '@angular/core';
import { FCCBase } from './../../../../../base/model/fcc-base';
import {
  FCCMVFormControl,
  FCCFormGroup,
} from './../../../../../base/model/fcc-control.model';

import {
  IDataEmittterModel,
  IUpdateFccBase,
} from '../../form-control-resolver/form-control-resolver.model';
import { FccGlobalConstant } from '../../../../../common/core/fcc-global-constants';
import { CommonService } from '../../../../../common/services/common.service';
import { FccConstants } from '../../../../../../app/common/core/fcc-constants';

@Component({
  selector: 'fcc-input-auto-comp',
  templateUrl: './input-auto-comp.component.html',
  styleUrls: ['./input-auto-comp.component.scss'],
})
export class InputAutoCompComponent
  extends FCCBase
  implements OnInit, AfterViewInit, IUpdateFccBase
{
  @Input() control!: FCCMVFormControl;
  @Input() form!: FCCFormGroup;
  @Input() mode!: string;
  @Input() hostComponentData!: any | null;
  @Output() controlDataEmitter: EventEmitter<IDataEmittterModel> =
    new EventEmitter<IDataEmittterModel>();
  compData = new Map<string, any>();

  constructor(protected commonService : CommonService) {
    super();
  }

  ngOnInit(): void {
    //eslint : no-empty-function
    this.commonService.inputAutoComp.subscribe(() => {
      this.updateValue();
    });
  }
  ngAfterViewInit(): void {
    this.updateValue();
  }

  updateValue(){
    if (this.form && this.form.value) {
      if (this.form.value.beneficiaryName) {
        this.control.options.forEach((item) => {
          if(item.label === this.form.value.beneficiaryName ||
            item.value[FccGlobalConstant.SHORT_NAME] === this.form.value.beneficiaryName) {
            this.inputValue = item.value[FccGlobalConstant.SHORT_NAME];
          }
        });
      } else if (this.form.value.beneficiaryEntity) {
        if((this.control.options.filter(task => task.value === this.form.value.beneficiaryEntity)).length > 0) {
        this.control.options.forEach((item) => {
          if(item.label === this.form.value.beneficiaryEntity.label ||
            item.value[FccGlobalConstant.SHORT_NAME] === this.form.value.beneficiaryEntity.label) {
            this.inputValue = item.value[FccGlobalConstant.NAME];
          }
        });
      } else {
        this.inputValue = this.form.value.beneficiaryEntity;
      }
      }
      else if (this.form.value.transBeneficiaryEntity) {
        if((this.control.options.filter(task => task.value === this.form.value.transBeneficiaryEntity)).length > 0) {
        this.control.options.forEach((item) => {
          if(item.label === this.form.value.transBeneficiaryEntity.name ||
            item.value[FccGlobalConstant.SHORT_NAME] === this.form.value.transBeneficiaryEntity.label) {
            this.inputValue = item.value[FccGlobalConstant.NAME];
          }
        });
      } else {
        this.inputValue = this.form.value.transBeneficiaryEntity;
      }
      }
      else if (this.form.value.draweeEntity) {
        if((this.control.options.filter(task => task.value === this.form.value.draweeEntity)).length > 0) {
        this.control.options.forEach((item) => {
          if(item.label === this.form.value.draweeEntity.name ||
            item.value[FccGlobalConstant.SHORT_NAME] === this.form.value.draweeEntity.label) {
            this.inputValue = item.value[FccGlobalConstant.NAME];
          }
        });
      } else {
        this.inputValue = this.form.value.draweeEntity;
      }
    } else if (this.form.value.assigneeEntity) {
      if((this.control.options.filter(task => task.value === this.form.value.assigneeEntity)).length > 0) {
      this.control.options.forEach((item) => {
        if(item.label === this.form.value.assigneeEntity.name ||
          item.value[FccGlobalConstant.SHORT_NAME] === this.form.value.assigneeEntity.label) {
          this.inputValue = item.value[FccGlobalConstant.NAME];
        }
      });
    } else {
      this.inputValue = this.form.value.assigneeEntity;
      }
    } else if (this.form.value.secondBeneficiaryEntity) {
      if((this.control.options.filter(task => task.value === this.form.value.secondBeneficiaryEntity)).length > 0) {
      this.control.options.forEach((item) => {
        if(item.label === this.form.value.secondBeneficiaryEntity.name ||
          item.value[FccGlobalConstant.SHORT_NAME] === this.form.value.secondBeneficiaryEntity.label) {
          this.inputValue = item.value[FccGlobalConstant.NAME];
        }
      });
    } else {
      this.inputValue = this.form.value.secondBeneficiaryEntity;
      }
    } else if (this.form.value.beneficiaryBankIfscCode && this.control?.key === FccConstants.BENE_BANK_IFSC_CODE) {
      if (this.control?.options && this.control?.options?.length > 0) {
        this.control?.options.forEach((item) => {
          if(item.label === this.form.value.beneficiaryBankIfscCode.name ||
            item.value[FccGlobalConstant.SHORT_NAME] === this.form.value.beneficiaryBankIfscCode.label) {
            this.inputValue = item.value[FccGlobalConstant.NAME];
          }
        });
      } else {
        this.inputValue = this.form.value.beneficiaryBankIfscCode;
      }
    }
    if (this.form.value.adhocFlag === FccConstants.BATCH_PAYMENT_ADHOC_FLOW &&
      this.control?.key !== FccConstants.BENE_BANK_IFSC_CODE){
        if (this.form.value.BeneficiaryName) {
          this.inputValue = this.form.value.BeneficiaryName;
        }
      }

    }

    this.controlDataEmitter.emit({
      control: this.control,
      data: this.compData,
    });
  }

}

