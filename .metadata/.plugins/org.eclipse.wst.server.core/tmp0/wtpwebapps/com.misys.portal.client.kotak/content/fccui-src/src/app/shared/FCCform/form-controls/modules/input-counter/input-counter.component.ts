import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { CommonService } from '../../../../../common/services/common.service';
import { FCCBase } from '../../../../../base/model/fcc-base';
import { FCCMVFormControl, FCCFormGroup } from '../../../../../base/model/fcc-control.model';
import { IUpdateFccBase, IDataEmittterModel } from '../../form-control-resolver/form-control-resolver.model';
@Component({
  selector: 'app-input-counter',
  templateUrl: './input-counter.component.html',
  styleUrls: ['./input-counter.component.scss']
})
export class InputCounterComponent extends FCCBase
implements OnInit, AfterViewInit, IUpdateFccBase
{
@Input() control!: FCCMVFormControl;
@Input() form!: FCCFormGroup;
@Input() mode!: string;
@Input() hostComponentData!: any | null;
@Output() controlDataEmitter: EventEmitter<IDataEmittterModel> =
  new EventEmitter<IDataEmittterModel>();
compData = new Map<string, any>();
enableHyperLink: boolean;
hyperLinkControl: any;
classValue: any;

constructor(protected commonService: CommonService, protected translateService: TranslateService) {
  super();
}

ngOnInit(): void {
  this.hyperLinkControl = this.commonService.isNonEmptyValue(this.control.params) ? this.control.params.hyperlinkData : '';
  if (this.commonService.isnonEMptyString(this.hyperLinkControl)){
    this.enableHyperLink = this.commonService.isNonEmptyValue(this.hyperLinkControl.showLink) ? this.hyperLinkControl.showLink : 'false';
}
}
ngAfterViewInit(): void {
  this.controlDataEmitter.emit({
    control: this.control,
    data: this.compData,
  });
}

  updateCounterData(controlKey: string, increment: boolean) {
    if (increment) {
      const newValue = this.form.get(controlKey).value + 1;
      this.form.get(controlKey).setValue(newValue);
    } else {
      const newValue = this.form.get(controlKey).value - 1;
      if (newValue > -1) {
        this.form.get(controlKey).setValue(newValue);
      }
    }
    this.hostComponentData.calculateCustomeTenorDays(this.control, increment);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  updateCounterDatabyInput(controlKey: string) {
    this.hostComponentData.calculateCustomeTenorDays(this.control);
  }
  getClass() {
    if (this.enableHyperLink){
      this.classValue = this.hyperLinkControl.position === 'right' ? 'flex-row' : 'flex-col';
      return this.classValue;
    }
  }
}
