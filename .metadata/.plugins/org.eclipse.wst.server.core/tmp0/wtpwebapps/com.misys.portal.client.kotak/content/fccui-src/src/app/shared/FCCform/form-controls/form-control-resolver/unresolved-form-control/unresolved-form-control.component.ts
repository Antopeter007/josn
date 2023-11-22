import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FCCBase } from '../../../../../base/model/fcc-base';
import {
  FCCMVFormControl,
  FCCFormGroup,
} from '../../../../../base/model/fcc-control.model';
import {
  IDataEmittterModel,
  IUpdateFccBase,
} from '../form-control-resolver.model';

@Component({
  selector: 'app-unresolved-form-control',
  templateUrl: './unresolved-form-control.component.html',
  styleUrls: ['./unresolved-form-control.component.scss'],
})
export class UnresolvedFormControlComponent
  extends FCCBase
  implements OnInit, IUpdateFccBase
{
  @Input() control!: FCCMVFormControl;
  @Input() form!: FCCFormGroup;
  @Input() mode!: any;
  @Input() hostComponentData!: any;
  @Output() controlDataEmitter: EventEmitter<IDataEmittterModel> =
    new EventEmitter<IDataEmittterModel>();
  compData = new Map<string, any>();

  constructor() {
    super();
  }

  ngOnInit(): void {
    //eslint : no-empty-function
  }
}
