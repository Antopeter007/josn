import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
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
import {
  IEditorData,
  IEditorProperties,
  IEditorPropertiesData,
} from "../../helper-components/highlight-editor/highlight-editor.model";
import { FccGlobalConstant } from "../../../../../common/core/fcc-global-constants";
import { ProductStateService } from "../../../../../corporate/trade/lc/common/services/product-state.service";
import { CommonService } from '../../../../../common/services/common.service';
import { TranslateService } from "@ngx-translate/core";

@Component({
  selector: 'fcc-amend-narrative-textarea',
  templateUrl: './amend-narrative-textarea.component.html',
  styleUrls: ['./amend-narrative-textarea.component.scss'],
})
export class AmendNarrativeTextareaComponent
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

  value: string;
  typeOfRegex: any;
  params = "params";
  errorCount = 0;
  text = "";
  enteredCharCount = "enteredCharCount";
  ErrorCountLabel: string;
  constructor(protected commonService: CommonService,
    protected stateService: ProductStateService,
    protected translate: TranslateService) {
    super();
  }

  highlightEditorProperties: IEditorProperties = {
    ...IEditorPropertiesData,
    showHighlight: (this.commonService.getQueryParametersFromKey('productCode') === 'LC' 
    && ((this.stateService.getSectionData(FccGlobalConstant.GENERAL_DETAILS).get('transmissionMode').value)[0].value))
    === FccGlobalConstant.TRANS_MODE_SWIFT ? true :
    (this.commonService.getQueryParametersFromKey('productCode') === 'SI' 
     && ((this.stateService.getSectionData(FccGlobalConstant.SI_GENERAL_DETAILS).get('transmissionMode').value)[0].value))
     === FccGlobalConstant.TRANS_MODE_SWIFT ? true :
     (this.commonService.getQueryParametersFromKey('productCode') === 'BG' 
     && ((this.stateService.getSectionData(FccGlobalConstant.UI_GENERAL_DETAILS).get('advSendMode').value)[0].value))
     === FccGlobalConstant.TRANS_MODE_SWIFT ? true : false,
     regex: null,
  };

  ngOnInit(): void {
    //eslint : no-empty-function
    this.value = this.control.value === null ? "" : this.control.value;
    this.typeOfRegex = this.form.get(this.control.key)[this.params][
      "typeOfRegex"
    ];
    if (this.typeOfRegex === "X") {
      this.highlightEditorProperties.regex = new RegExp(
        FccGlobalConstant.X_CHARACTER_NOT_ALLOWED,
        "gm"
      );
    } else if (this.typeOfRegex === "Z") {
      this.highlightEditorProperties.regex = new RegExp(
        FccGlobalConstant.Z_CHARACTER_NOT_ALLOWED,
        "gm"
      );
    }
    this.ErrorCountLabel = this.translate.instant('ErrorCountLabel');
  }

  getHighlightEditorData(data: IEditorData) {
    this.errorCount = data.errorCount;
    this.text = data.text;
    const count = this.commonService.counterOfPopulatedData(this.text);
    this.control[this.params][this.enteredCharCount] = count;
  }

  ngOnDestroy() {
    this.control.setValue(this.text);
  }

  ngAfterViewInit(): void {
    this.controlDataEmitter.emit({
      control: this.control,
      data: this.compData,
    });
  }
}
