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
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'fcc-input-multiselect',
  templateUrl: './input-multiselect.component.html',
  styleUrls: ['./input-multiselect.component.scss'],
})
export class InputMultiselectComponent
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

  constructor(protected translateService: TranslateService) {
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
    this.addAccessibilityControl();
  }

  addAccessibilityControl(): void {
      document.getElementById(this.labelId).innerText = this.translateService.instant(this.control.params.placeholder) ?? '';
   }

  get labelId(): string {
    return 'pMultiSelectLabel_' + this.control.key;
  }

  onPanelShowHandler(): void {
    const multiSelectClose = Array.from(document.getElementsByClassName('ui-multiselect-close'));
    multiSelectClose.forEach(element => {
      element[FccGlobalConstant.ARIA_LABEL] = this.translateService.instant("close");
      element[FccGlobalConstant.TITLE] = this.translateService.instant("close");
    });
  }
}
