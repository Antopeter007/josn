import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

import { IDataEmittterModel, IUpdateFccBase } from '../../form-control-resolver/form-control-resolver.model';
import { FCCBase } from './../../../../../base/model/fcc-base';
import { FCCFormGroup, FCCMVFormControl } from './../../../../../base/model/fcc-control.model';

@Component({
  selector: 'fcc-view-mode',
  templateUrl: './view-mode.component.html',
  styleUrls: ['./view-mode.component.scss'],
})
export class ViewModeComponent
  extends FCCBase
  implements OnInit, AfterViewInit, IUpdateFccBase {
  @Input() control!: FCCMVFormControl;
  @Input() form!: FCCFormGroup;
  @Input() mode!: string;
  @Input() hostComponentData!: any | null;
  @Output() controlDataEmitter: EventEmitter<IDataEmittterModel> =
    new EventEmitter<IDataEmittterModel>();
  compData = new Map<string, any>();
  errorHeader = `${this.translateService.instant('errorTitle')}`;

  constructor(
    protected translateService: TranslateService) {
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
