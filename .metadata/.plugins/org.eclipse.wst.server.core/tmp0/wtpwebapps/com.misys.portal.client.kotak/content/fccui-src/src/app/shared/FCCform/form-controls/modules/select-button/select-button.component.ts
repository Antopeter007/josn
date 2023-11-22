import {
  AfterViewInit,
  Component,
  EventEmitter,
  Output,
  Input,
  OnInit,
  ViewChildren,
  QueryList,
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

@Component({
  selector: 'fcc-select-button.w-full',
  templateUrl: './select-button.component.html',
  styleUrls: ['./select-button.component.scss'],
})
export class SelectButtonComponent
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
  @ViewChildren('selBtn') myDivElementRef: QueryList<any>;

  constructor() {
    super();
  }

  ngOnInit(): void {
    //eslint : no-empty-function
  }
  ngAfterViewInit(): void {
    this.compData.set('myDivElementRef', this.myDivElementRef);
    this.controlDataEmitter.emit({
      control: this.control,
      data: this.compData,
    });
  }
}
