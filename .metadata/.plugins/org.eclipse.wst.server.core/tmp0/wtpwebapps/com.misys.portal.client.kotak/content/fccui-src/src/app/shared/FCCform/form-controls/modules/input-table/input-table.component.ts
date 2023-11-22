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
import { CommonService } from '../../../../../common/services/common.service';
import { FileHandlingService } from '../../../../../common/services/file-handling.service';
import { FccGlobalConstant } from './../../../../../common/core/fcc-global-constants';

@Component({
  selector: 'fcc-input-table',
  templateUrl: './input-table.component.html',
  styleUrls: ['./input-table.component.scss'],
})
export class InputTableComponent
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
  errorHeader = `${this.translateService.instant('errorTitle')}`;
  contextPath: string;
  allowedDocViewerType: string[] = [];
  dir = 'right';

  constructor(protected translateService: TranslateService, 
    protected commonService: CommonService, 
    protected fileHandlingService: FileHandlingService) {
    super();
  }

  ngOnInit(): void {
    //eslint : no-empty-function
    this.contextPath = this.commonService.getContextPath();
    this.commonService.getAllowedDocViewerMimeTypes();
    this.allowedDocViewerType = this.commonService.allowedDocViewerMimeTypes;
    this.dir = localStorage.getItem(FccGlobalConstant.LANGUAGE) === FccGlobalConstant.LANGUAGE_AR ? 'center' : 'right';
  }
  ngAfterViewInit(): void {
    this.controlDataEmitter.emit({
      control: this.control,
      data: this.compData,
    });
  }

  onClickViewFile(docId, fileName) {
    this.fileHandlingService.viewFile(docId, fileName);
  }
}
