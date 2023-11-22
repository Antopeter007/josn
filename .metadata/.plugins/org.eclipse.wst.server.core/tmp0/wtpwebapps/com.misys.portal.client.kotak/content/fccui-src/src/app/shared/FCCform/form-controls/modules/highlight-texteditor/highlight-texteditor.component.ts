import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from "@angular/core";
import { FCCBase } from "./../../../../../base/model/fcc-base";
import {
  FCCMVFormControl,
  FCCFormGroup,
} from "./../../../../../base/model/fcc-control.model";
import { CommonService } from "./../../../../../common/services/common.service";
import {
  IDataEmittterModel,
  IUpdateFccBase,
} from "../../form-control-resolver/form-control-resolver.model";
import { HighlightHtmlPipe } from "../../helper-components/highlight-editor/highlight-html.pipe";
import {
  IEditorData,
  IEditorProperties,
  IEditorPropertiesData,
} from "../../helper-components/highlight-editor/highlight-editor.model";
import { FccGlobalConstant } from "../../../../../common/core/fcc-global-constants";
import { ProductStateService } from "../../../../../corporate/trade/lc/common/services/product-state.service";
import { TranslateService } from "@ngx-translate/core";

@Component({
  selector: "app-highlight-texteditor",
  templateUrl: "./highlight-texteditor.component.html",
  styleUrls: ["./highlight-texteditor.component.scss"],
})
export class HighlightTexteditorComponent
  extends FCCBase
  implements OnInit, AfterViewInit, IUpdateFccBase
{
  value: string;
  typeOfRegex: string;
  ErrorCountLabel: string;
  constructor(
    protected highLightHtmlPipe: HighlightHtmlPipe,
    protected commonService: CommonService,
    protected stateService: ProductStateService,
    protected translate: TranslateService
  ) {
    super();
  }
  compData = new Map<string, any>();
  @Input() control!: FCCMVFormControl;
  @Input() form!: FCCFormGroup;
  @Input() mode!: string;
  @Input() hostComponentData!: any | null;
  @Output() controlDataEmitter: EventEmitter<IDataEmittterModel> =
    new EventEmitter<IDataEmittterModel>();

  errorCount = 0;
  text = "";
  params = "params";
  enteredCharCount = "enteredCharCount";
  highlightEditorProperties: IEditorProperties = {
    ...IEditorPropertiesData,
    showHighlight: (this.commonService.getQueryParametersFromKey('productCode') === 'LC'
    && (this.stateService.getSectionData(FccGlobalConstant.GENERAL_DETAILS).get('transmissionMode').value))
    === FccGlobalConstant.TRANS_MODE_SWIFT ? true :
    (this.commonService.getQueryParametersFromKey('productCode') === 'LC'
    && this.stateService.getSectionData(FccGlobalConstant.GENERAL_DETAILS).get('transmissionMode').value[0]
    && ((this.stateService.getSectionData(FccGlobalConstant.GENERAL_DETAILS).get('transmissionMode').value)[0].value))
    === FccGlobalConstant.TRANS_MODE_SWIFT ? true :
    (this.commonService.getQueryParametersFromKey('productCode') === 'SI'
    && (this.stateService.getSectionData('siGeneralDetails').get('transmissionMode').value))
    === FccGlobalConstant.TRANS_MODE_SWIFT ? true :
    (this.commonService.getQueryParametersFromKey('productCode') === 'SI'
    && this.stateService.getSectionData('siGeneralDetails').get('transmissionMode').value[0]
    && ((this.stateService.getSectionData('siGeneralDetails').get('transmissionMode').value)[0].value))
    === FccGlobalConstant.TRANS_MODE_SWIFT ? true :
    (this.commonService.getQueryParametersFromKey('productCode') === 'BG'
    && (this.stateService.getSectionData('uiGeneralDetails').get('advSendMode').value))
    === FccGlobalConstant.TRANS_MODE_SWIFT ? true :
    (this.commonService.getQueryParametersFromKey('productCode') === 'BG'
    && this.stateService.getSectionData('uiGeneralDetails').get('advSendMode').value[0]
    && ((this.stateService.getSectionData('uiGeneralDetails').get('advSendMode').value)[0].value))
    === FccGlobalConstant.TRANS_MODE_SWIFT ? true : false,
    regex: null,
  };

  ngOnInit() {
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
    this.value = this.control.value === null ? "" : this.control.value;
    this.ErrorCountLabel = this.translate.instant("ErrorCountLabel");
  }

  ngAfterViewInit(): void {
    if((this.control.value===null || this.control.value==='') && this.value){
      this.control.setValue(this.value);
    }
    this.controlDataEmitter.emit({
      control: this.control,
      data: this.compData,
    });
  }

  getHighlightEditorData(data: IEditorData) {
    this.errorCount = data.errorCount;
    this.text = data.text;
    if(this.text.endsWith('\n')) {
      this.text = this.text.slice(0,-1);
    }
    const cols = this.control['params']['cols'];
    const count = this.commonService.counterOfPopulatedData(this.text, cols);
    this.control[this.params][this.enteredCharCount] = count;
    this.checkNextLineChar();
  }

  checkNextLineChar() {
    if(this.control.value === "\n") {
      this.control[this.params][this.enteredCharCount]= 0;
      if (this.control[this.params]['required'] ) {
        this.control.setErrors({ required: true });
      }
    }
  }

}
