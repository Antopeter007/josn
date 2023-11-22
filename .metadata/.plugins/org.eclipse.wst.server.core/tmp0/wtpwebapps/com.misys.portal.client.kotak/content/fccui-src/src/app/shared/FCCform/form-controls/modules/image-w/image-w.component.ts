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

@Component({
  selector: 'fcc-image-w',
  templateUrl: './image-w.component.html',
  styleUrls: ['./image-w.component.scss'],
})
export class ImageWComponent
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
  titleVal;
  constructor(protected translateService: TranslateService ) {
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
    if (this.control.key == 'downloadAttachment' && this.control.params.titleVal != '') {
      this.titleVal = `${this.translateService.instant(this.control.params.titleVal)}`;
    } else {
      this.titleVal = `${this.translateService.instant('textualDescriptionOfInternalNewsImage')}`;
    }
  }
}
