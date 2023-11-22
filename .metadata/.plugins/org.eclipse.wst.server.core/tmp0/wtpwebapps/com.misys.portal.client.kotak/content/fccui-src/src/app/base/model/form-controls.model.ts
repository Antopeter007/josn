import { TranslateService } from '@ngx-translate/core';

import { FCCButtonControl, FCCFormControl, FCCLayoutControl, FCCMVFormControl } from './fcc-control.model';

export class DropdownFormControl extends FCCMVFormControl {
  constructor(id: string, value: any, translate: TranslateService, params: {} = {}, pdfParams?: {}) {
    super('input-dropdown', id, value, translate, params, pdfParams);
  }
}

export class MultiSelectFormControl extends FCCMVFormControl {
  constructor(id: string, value: any, translate: TranslateService, params: {} = {}, pdfParams?: {}) {
    super('input-multiselect', id, value, translate, params, pdfParams);
  }
}

export class DropdownFilterFormControl extends FCCMVFormControl {
  constructor(id: string, value: any, translate: TranslateService, params: {} = {}, pdfParams?: {}) {
    super('input-dropdown-filter', id, value, translate, params, pdfParams);
  }
}

export class RadioGroupFormControl extends FCCMVFormControl {
  constructor(id: string, value: any, translate: TranslateService, params: {} = {}, pdfParams?: {}) {
    super('input-radio', id, value, translate, params, pdfParams);
  }
}

export class RadioCheckFormControl extends FCCMVFormControl {
  constructor(id: string, value: any, translate: TranslateService, params: {} = {}, pdfParams?: {}) {
    super('input-radio-check', id, value, translate, params, pdfParams);
  }
}

export class ImageFormControl  extends FCCLayoutControl {
  constructor(id: string, translate: TranslateService, params: {} = {}) {
    super('image', id, translate, params);
  }
}
export class InputPasswordControl extends FCCFormControl {
  constructor(id: string, value: any, translate: TranslateService, params: {} = {}) {
    super('input-password', id, value, translate, params);
  }
}

export class CheckboxFormControl extends FCCMVFormControl {
  constructor(id: string, value: any, translate: TranslateService, params: {} = {}, pdfParams?: {}) {
    super('input-cb', id, value, params, pdfParams);
  }
}

export class MatCheckboxFormControl extends FCCFormControl {
  constructor(id: string, value: any, translate: TranslateService,  params: {} = {}, pdfParams?: {}) {
    super('checkbox', id, value, translate, params, pdfParams);
  }
}

export class InputSwitchControl extends FCCFormControl {
  constructor(id: string, value: any, translate: TranslateService, params: {} = {}) {
     super('input-switch', id , value, translate, params);
  }
}

export class TemplateControl extends FCCLayoutControl {
  context: any;
  constructor(translate: TranslateService, params: {} = {}, context: any) {
    super('template', null, translate, params);
    this.context = context;
  }
}

export class InputTextControl extends FCCFormControl {
  constructor(id: string, value: any, translate: TranslateService, params: {} = {}, pdfParams?: {}) {
    super('input-text', id, value, translate, params, pdfParams, pdfParams);
  }
}

export class CaptchaControl extends FCCFormControl {
  constructor(id: string, value: any, translate: TranslateService, params: {} = {}) {
    super('re-captcha', id, null, translate, params);
  }
}

export class InputTextareaControl extends FCCFormControl {
  constructor(id: string, value: any, translate: TranslateService, params: {} = {}, pdfParams?: {}) {
    super('input-textarea', id, value, translate, params, pdfParams);
  }
}

export class InputAmountControl extends FCCFormControl {
  constructor(id: string, value: any, translate: TranslateService, params: {} = {}, pdfParams?: {}) {
    super('amount', id, value, translate, params, pdfParams);
  }
}

export class InputIconControl extends FCCFormControl {
  constructor(id: string, translate: TranslateService, params: {} = {}) {
      super('icon', id , null, translate,  params);
  }
}

export class SelectButtonControl extends FCCMVFormControl {
  constructor(id: string, value: any, translate: TranslateService, params: {} = {}, pdfParams?: {}) {
      super('select-button', id , value, translate, params, pdfParams);
  }
}

export class InputDateControl extends FCCFormControl {
  constructor(id: string, value: any, translate: TranslateService, params: {} = {}, pdfParams?: {}) {
    super('input-date', id, value, translate, params, pdfParams);
  }
}

export class InputDateRangeControl extends FCCFormControl {
  constructor(id: string, value: any, translate: TranslateService, params: {} = {}, pdfParams?: {}) {
    super('input-date-range', id, value, translate, params, pdfParams);
  }
}

export class InputBackDateControl extends FCCFormControl {
  constructor(id: string, value: any, translate: TranslateService, params: {} = {}, pdfParams?: {}) {
    super('input-backdate', id, value, translate, params, pdfParams);
  }
}
export class RoundedButtonControl extends FCCButtonControl {
  constructor( id: string, translate: TranslateService, params: {} = {}) {
     super('rounded-button', id , translate, params);
  }
}

export class ButtonControl extends FCCButtonControl {
  constructor(id: string, translate: TranslateService, params: {} = {}) {
    super('button', id , translate, params);
  }
}

export class ProgressBarControl extends FCCFormControl {
  constructor(id: string, value: any, translate: TranslateService, params: {} = {}) {
     super('progress-bar', id, value , translate,  params);
  }
}

export class OpenDivControl extends FCCLayoutControl {
  constructor(id: string, translate: TranslateService, params: {} = {}) {
    super('layout-div-open', id, translate, params);
  }
}

export class DivControl extends FCCLayoutControl {
  constructor(id: string, translate: TranslateService, params: {} = {}) {
    super('button-div', id, translate, params);
  }
}

export class TabControl extends FCCLayoutControl {
  constructor(id: string, translate: TranslateService, params: {} = {}) {
    super('tab', id, translate, params);
  }
}

export class NarrativeTextareaControl extends FCCFormControl {
  constructor(id: string, value: any, translate: TranslateService, params: {} = {}, pdfParams?: {}) {
    super('narrative-textarea', id, value, translate, params, pdfParams);
  }
}

export class EditorControl extends FCCFormControl {
  constructor(id: string, value: any, translate: TranslateService, params: {} = {}, pdfParams?: {}) {
    super('editor', id, value, translate, params, pdfParams);
  }
}

export class AmendNarrativeTextareaControl extends FCCFormControl {
  constructor(id: string, value: any, translate: TranslateService, params: {} = {}, pdfParams?: {}) {
    super('amend-narrative-textarea', id, value, translate, params, pdfParams);
  }
}

export class TextControl extends FCCFormControl {
  constructor(id: string, translate: TranslateService, params: {} = {}, pdfParams?: {}) {
    super('text', id, null, translate,  params, pdfParams);
  }
}

export class SummaryTextControl extends FCCFormControl {
  constructor(id: string, translate: TranslateService, params: {} = {}, pdfParams?: {}) {
    super('summary-text', id, null, translate,  params, pdfParams);
  }
}

export class TextComparisonControl extends FCCFormControl {
  constructor(id: string, value: any, translate: TranslateService, params: {} = {}, pdfParams?: {}) {
    super('text-comparison', id, value, translate,  params, pdfParams);
  }
}

export class ViewModeControl extends FCCFormControl {
  constructor(id: string, value: any, translate: TranslateService, params: {} = {}, pdfParams?: {}) {
    super('view-mode', id, value, translate, params, pdfParams);
  }
}

export class TextValueControl extends FCCFormControl {
  constructor(id: string, value: any, translate: TranslateService, params: {} = {}) {
    super('text-value', id, value, translate, params);
  }
}

export class SelectViewModeControl extends FCCFormControl {
  constructor(id: string, value: any, translate: TranslateService, params: {} = {}, pdfParams?: {}) {
    super('view-mode-select', id, value, translate, params, pdfParams);
  }
}

export class ImgControl extends FCCFormControl {
  constructor(id: string, translate: TranslateService, params: {} = {}) {
    super('imageW', id, null, translate, params);
  }
}

export class HrControl extends FCCFormControl {
  constructor(id: string, translate: TranslateService, params: {} = {}) {
    super('HRTAG', id, null, translate, params);
  }
}

export class SpacerControl extends FCCLayoutControl {
  constructor(translate: TranslateService, params: {} = {}) {
    super('spacer', null, translate, params);
  }
}
export class FileUploadControl extends FCCButtonControl {
  constructor( id: string, translate: TranslateService, params: {} = {}) {
     super('fileUpload', id , translate, params);
  }
}

export class TableControl extends FCCFormControl {
  constructor(id: string, value: any, translate: TranslateService, params: {} = {}) {
    super('input-table', id, value, translate, params);
  }
}

export class CardControl extends FCCFormControl {
  constructor(id: string, value: any, translate: TranslateService, params: {} = {}) {
    super('card-view', id, value, translate, params);
  }
}


export class EditTableControl extends FCCFormControl {
  constructor(id: string, value: any, translate: TranslateService, params: {} = {}) {
    super('edit-table', id, value, translate, params);
  }
}
export class ExchangeRateControl extends FCCFormControl {
  constructor(id: string, value: any, translate: TranslateService, params: {} = {}) {
    super('exchange-rate', id, value, translate, params);
  }
}

export class CarouselViewControl extends FCCFormControl {
  constructor(id: string, value: any, translate: TranslateService, params: {} = {}) {
    super('carousel-view', id, value, translate, params);
    
  }
}

export class ThreeDotsButtonControl extends FCCFormControl {
  constructor(id: string, value: any, translate: TranslateService, params: {} = {}) {
    super('threeDots-button', id, value, translate, params);
    
  }
}

export class FileUploadDragDropControl extends FCCButtonControl {
  constructor( id: string, translate: TranslateService, params: {} = {}) {
     super('fileUpload-dragdrop', id , translate, params);
  }
}
export class DialogWindowControl extends FCCFormControl {
  constructor(id: string, value: any, translate: TranslateService, params: {} = {}) {
     super('dialog-window', id, value , translate, params);
  }
}
export class ExpansionPanelControl extends FCCFormControl {
  constructor(id: string, value: any, translate: TranslateService, params: {} = {}) {
    super('expansion-panel', id, value, translate, params);
  }
}
export class AccordionControl extends FCCLayoutControl {
  constructor(id: string, translate: TranslateService, params: {} = {}) {
    super('accordion', id, translate, params);
  }
}

export class TimerControl extends FCCFormControl {
  constructor(id: string, value: any, translate: TranslateService, params: {} = {}) {
    super('timer', id, null, translate, params);
  }
}

export class MatCardControl extends FCCLayoutControl {
  constructor(id: string, translate: TranslateService, params: {} = {}) {
    super('mat-card', id, translate, params);
  }
}

export class JSONObjControl extends FCCFormControl {
  constructor(id: any, value: {} = {}, translate: TranslateService, params: {} = {}) {
    super('json-obj', id, value, translate, params);
  }
}

export class FormTableControl extends FCCFormControl {
  constructor(id: string, value: any, translate: TranslateService, params: {} = {}) {
    super('form-table', id, value, translate, params);
  }
}

export class FormAccordionControl extends FCCLayoutControl {
  constructor(id: string, translate: TranslateService, params: {} = {}) {
    super('form-accordion-panel', id, translate, params);
  }
}

export class ExpansionPanelTableControl extends FCCFormControl {
  constructor(id: string, value: any, translate: TranslateService, params: {} = {}) {
    super('expansion-panel-table', id, value, translate, params);
  }
}

export class MatAutoCompControl extends FCCMVFormControl {
  constructor(id: string, value: any, translate: TranslateService, params: {} = {}, pdfParams?: {}) {
    super('input-auto-comp', id, value, translate, params, pdfParams);
  }
}

export class FccCurrencyControl extends FCCFormControl {
  constructor(id: string, value: any, translate: TranslateService, params: {} = {}, pdfParams?: {}) {
    super('fcc-currency', id, value, translate, params, pdfParams, pdfParams);
  }
}

export class CalenderDateControl extends FCCFormControl {
  constructor(id: string, value: any, translate: TranslateService, params: {} = {}) {
    super('input-counter', id, value, translate, params);
  }
}

export class ExpansionPanelEditTableControl extends FCCFormControl {
  constructor(id: string, value: any, translate: TranslateService, params: {} = {}) {
    super('expansion-panel-edit-table', id, value, translate, params);
  }
}
export class ExpansionPanelEditFormTableControl extends FCCFormControl {
  constructor(id: string, value: any, translate: TranslateService, params: {} = {}) {
    super('expansion-panel-edit-form-table', id, value, translate, params);
  }
}

export class CardSummaryControl extends FCCFormControl {
  constructor(id: string, value: any, translate: TranslateService, params: {} = {}) {
    super('card-summary', id, value, translate, params);
  }
}

export class HighlightTextEditorControl extends FCCFormControl {
  constructor(id: string, value: any, translate: TranslateService, params: {} = {}, pdfParams?: {}) {
    super('highlight-texteditor', id, value, translate, params, pdfParams);
  }
}

export class FCCFileViewerControl extends FCCLayoutControl {
  constructor(id: string, translate: TranslateService, params: {} = {}) {
    super('fcc-file-viewer', id, translate, params);
  }
}

export class FCCListBoxControl extends FCCLayoutControl {
  constructor(id: string, translate: TranslateService, params: {} = {}) {
    super('fcc-list-box', id, translate, params);
  }
}
