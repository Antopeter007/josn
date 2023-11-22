import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FCCBase } from './../../../../../base/model/fcc-base';
import { FCCFormGroup, FCCMVFormControl } from './../../../../../base/model/fcc-control.model';
import { IUpdateFccBase, IDataEmittterModel } from '../../form-control-resolver/form-control-resolver.model';

@Component({
  selector: 'app-summary-text',
  templateUrl: './summary-text.component.html',
  styleUrls: ['./summary-text.component.scss']
})
export class SummaryTextComponent extends FCCBase
implements OnInit, AfterViewInit, IUpdateFccBase
{
@Input() control!: FCCMVFormControl;
@Input() form!: FCCFormGroup;
@Input() mode!: string;
@Input() hostComponentData!: any | null;
@Output() controlDataEmitter: EventEmitter<IDataEmittterModel> =
  new EventEmitter<IDataEmittterModel>();
compData = new Map<string, any>();

constructor() {
  super();
}

ngOnInit(): void {
  //eslint : no-empty-function
}
ngAfterViewInit(): void {
  this.controlDataEmitter.emit({
    control: this.control,
    data: this.compData,
  });
}
}
