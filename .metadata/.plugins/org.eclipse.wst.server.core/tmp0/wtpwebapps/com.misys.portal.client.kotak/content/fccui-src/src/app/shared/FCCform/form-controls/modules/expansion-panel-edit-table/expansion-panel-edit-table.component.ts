import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { IDataEmittterModel, IUpdateFccBase } from '../../form-control-resolver/form-control-resolver.model';
import { FCCBase } from './../../../../../base/model/fcc-base';
import { FCCFormGroup, FCCMVFormControl } from './../../../../../base/model/fcc-control.model';

@Component({
  selector: 'fcc-expansion-panel-edit-table',
  templateUrl: './expansion-panel-edit-table.component.html',
  styleUrls: ['./expansion-panel-edit-table.component.scss']
})
export class ExpansionPanelEditTableComponent
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
  handleAccordinClose(event, opt) {
    opt.open = false;
  }
  handleAccordinOpen(event, opt) {
    opt.open = true;
  }
}
