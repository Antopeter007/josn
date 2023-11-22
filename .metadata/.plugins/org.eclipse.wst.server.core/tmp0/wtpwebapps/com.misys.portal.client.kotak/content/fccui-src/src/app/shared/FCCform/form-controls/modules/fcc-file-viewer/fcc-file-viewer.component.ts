import { FCCBase } from './../../../../../base/model/fcc-base';
import { FCCFormGroup, FCCMVFormControl } from './../../../../../base/model/fcc-control.model';
import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { IDataEmittterModel, IUpdateFccBase } from '../../form-control-resolver/form-control-resolver.model';
import { pdfDefaultOptions } from 'ngx-extended-pdf-viewer';
import { CommonService } from '../../../../../common/services/common.service';


@Component({
  selector: 'fcc-file-viewer',
  templateUrl: './fcc-file-viewer.component.html',
  styleUrls: ['./fcc-file-viewer.component.scss']
})
export class FccFileViewerComponent extends FCCBase
  implements OnInit, AfterViewInit, IUpdateFccBase
{
    @Input() control!: FCCMVFormControl;
    @Input() form!: FCCFormGroup;
    @Input() mode!: string;
    @Input() hostComponentData!: any | null;
    @Output() controlDataEmitter: EventEmitter<IDataEmittterModel> =
      new EventEmitter<IDataEmittterModel>();
    compData = new Map<string, any>();
    @Input() data: any;
    docUrl: string;



    constructor(protected commonService: CommonService) {
      super();
    }

    ngOnInit(): void {
      this.docUrl = this.data.docUrl;
      pdfDefaultOptions.assetsFolder = './content/FCCUI/assets';

    }



    ngAfterViewInit(): void {
      this.controlDataEmitter.emit({
        control: this.control,
        data: this.compData,
      });
    }
}
