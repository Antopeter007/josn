import {
  AfterViewInit,
  Component,
  EventEmitter,
  Output,
  Input,
  OnInit,
} from '@angular/core';
import { CommonService } from '../../../../../../app/common/services/common.service';

import { FCCBase } from '../../../../../base/model/fcc-base';
import {
  FCCMVFormControl,
  FCCFormGroup,
} from '../../../../../base/model/fcc-control.model';

import {
  IDataEmittterModel,
  IUpdateFccBase,
} from '../../form-control-resolver/form-control-resolver.model';

@Component({
  selector: 'fcc-input-text.w-full',
  templateUrl: './fcc-input-text.component.html',
  styleUrls: ['./fcc-input-text.component.scss'],
})
export class FCCInputTextComponent
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
  contextPath: any;
  enableBlockCopyPaste = false;

  constructor(
    protected commonService: CommonService
  ) {
    super();
  }

  ngOnInit(): void {
    //eslint : no-empty-function
    this.contextPath = this.commonService.getContextPath();
    this.enableBlockCopyPaste = this.control.params?.blockCopyPaste ?
    this.control.params?.blockCopyPaste : this.enableBlockCopyPaste;
  }

  onPaste(event) {
    if(this.enableBlockCopyPaste === true) {
      event.preventDefault();
    }
  }

  onCopy(event) {
    if(this.enableBlockCopyPaste === true) {
      event.preventDefault();
    }
  }

  onCut(event) {
    if(this.enableBlockCopyPaste === true) {
      event.preventDefault();
    }
  }

  ngAfterViewInit(): void {
    this.controlDataEmitter.emit({
      control: this.control,
      data: this.compData,
    });
  }
}
