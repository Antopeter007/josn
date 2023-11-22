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
import { TranslateService } from '@ngx-translate/core';
import { CommonService } from '../../../../../common/services/common.service';


@Component({
  selector: 'fcc-input-dropdown.w-full',
  templateUrl: './input-dropdown.component.html',
  styleUrls: ['./input-dropdown.component.scss'],
})
export class InputDropdownComponent
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
  enableHyperLink: boolean;
  hyperLinkControl: any;
  classValue: any;

  constructor(protected commonService: CommonService, protected translateService: TranslateService ) {
    super();
  }

  ngOnInit(): void {
    this.hyperLinkControl = this.commonService.isNonEmptyValue(this.control.params) ? this.control.params.hyperlinkData : '';
    if (this.commonService.isnonEMptyString(this.hyperLinkControl)){
      this.enableHyperLink = this.commonService.isNonEmptyValue(this.hyperLinkControl.showLink) ? this.hyperLinkControl.showLink : 'false';
  }
  }

  getClass() {
    if (this.enableHyperLink){
      this.classValue = this.hyperLinkControl.position === 'right' ? 'flex-row' : 'flex-col';
      return this.classValue;
    }
  }
  ngAfterViewInit(): void {
    this.controlDataEmitter.emit({
      control: this.control,
      data: this.compData,
    });
  }
}
