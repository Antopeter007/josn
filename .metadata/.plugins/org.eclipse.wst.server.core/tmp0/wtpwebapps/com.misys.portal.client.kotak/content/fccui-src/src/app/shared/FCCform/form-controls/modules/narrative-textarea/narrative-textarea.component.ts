import {
  AfterViewInit,
  Component,
  EventEmitter,
  Output,
  Input,
  OnInit,
  ElementRef,
  ViewChild,
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
  selector: 'fcc-narrative-textarea',
  templateUrl: './narrative-textarea.component.html',
  styleUrls: ['./narrative-textarea.component.scss'],
})
export class NarrativeTextareaComponent
  extends FCCBase
  implements OnInit, AfterViewInit, IUpdateFccBase
{
  @Input() control!: FCCMVFormControl;
  @Input() form!: FCCFormGroup;
  @Input() mode!: string;
  @Input() hostComponentData!: any | null;
  @Output() controlDataEmitter: EventEmitter<IDataEmittterModel> =
    new EventEmitter<IDataEmittterModel>();
  value: string;
  count: number;
  params = "params";
  enteredCharCount = "enteredCharCount";

  compData = new Map<string, any>();
  @ViewChild('fccCommonTextAreaId') fccCommonTextAreaId: ElementRef;

  constructor() {
    super();
  }

  ngOnInit(): void {
    this.value = this.control.value === null ? "" : this.control.value;
    this.count = this.control[this.params][this.enteredCharCount];
  }
  ngAfterViewInit(): void {
    if((this.control.value===null || this.control.value==='') && this.value){
      this.control.setValue(this.value);
      this.control[this.params][this.enteredCharCount]=this.count;
    }
    this.compData.set('fccCommonTextAreaId', this.fccCommonTextAreaId);
    this.controlDataEmitter.emit({
      control: this.control,
      data: this.compData,
    });
  }
}

