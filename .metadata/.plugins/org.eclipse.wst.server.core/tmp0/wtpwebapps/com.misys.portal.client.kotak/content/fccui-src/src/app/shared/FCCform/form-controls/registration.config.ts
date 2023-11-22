import { FccFileViewerComponent } from './modules/fcc-file-viewer/fcc-file-viewer.component';
import { ROOT_FORM_CONFIG } from './form-control-collection.config';
import { IFCCRegistrationConfig } from './form-control-resolver/form-control-resolver.model';
import { AccordionComponent } from './modules/accordion/accordion.component';
import { AccordionModule } from './modules/accordion/accordion.module';
import { AmendNarrativeTextareaComponent } from './modules/amend-narrative-textarea/amend-narrative-textarea.component';
import { AmendNarrativeTextareaModule } from './modules/amend-narrative-textarea/amend-narrative-textarea.module';
import { FCCAmountComponent } from './modules/amount/fcc-amount.component';
import { AmountModule } from './modules/amount/fcc-amount.module';
import { ButtonDivComponent } from './modules/button-div/button-div.component';
import { ButtonDivModule } from './modules/button-div/button-div.module';
import { ButtonComponent } from './modules/button/button.component';
import { FCCButtonModule } from './modules/button/button.module';
import { CardViewComponent } from './modules/card-view/card-view.component';
import { CardViewModule } from './modules/card-view/card-view.module';
import { FCCCheckboxComponent } from './modules/checkbox/fcc-checkbox.component';
import { CheckboxModule } from './modules/checkbox/fcc-checkbox.module';
import { CurrencyComponent } from './modules/currency/currency.component';
import { CurrencyModule } from './modules/currency/currency.module';
import { DialogWindowComponent } from './modules/dialog-window/dialog-window.component';
import { DialogWindowModule } from './modules/dialog-window/dialog-window.module';
import { EditTableComponent } from './modules/edit-table/edit-table.component';
import { EditTableModule } from './modules/edit-table/edit-table.module';
import { CarouselViewComponent } from './modules/carousel-view/carousel-view.component';
import { CarouselViewModule } from './modules/carousel-view/carousel-view.module';
import { EditorComponent } from './modules/editor/editor.component';
import { EditorModule } from './modules/editor/editor.module';
import { ExpansionPanelEditTableComponent } from './modules/expansion-panel-edit-table/expansion-panel-edit-table.component';
import { ExpansionPanelEditTableModule } from './modules/expansion-panel-edit-table/expansion-panel-edit-table.module';

import { ExpansionPanelEditFormTableComponent } from './modules/expansion-panel-edit-form-table/expansion-panel-edit-form-table.component';
import { ExpansionPanelTableComponent } from './modules/expansion-panel-table/expansion-panel-table.component';
import { ExpansionPanelTableModule } from './modules/expansion-panel-table/expansion-panel-table.module';
import { ExpansionPanelComponent } from './modules/expansion-panel/expansion-panel.component';
import { ExpansionPanelModule } from './modules/expansion-panel/expansion-panel.module';
import { FeesAndChargesComponent } from './modules/fees-and-charges/fees-and-charges.component';
import { FeesAndChargesModule } from './modules/fees-and-charges/fees-and-charges.module';
import { FileUploadDragdropComponent } from './modules/file-upload-dragdrop/file-upload-dragdrop.component';
import { FileUploadDragdropModule } from './modules/file-upload-dragdrop/file-upload-dragdrop.module';
import { FileUploadComponent } from './modules/file-upload/file-upload.component';
import { FCCFileUploadModule } from './modules/file-upload/file-upload.module';
import { FormAccordionPanelComponent } from './modules/form-accordion-panel/form-accordion-panel.component';
import { FormAccordionPanelModule } from './modules/form-accordion-panel/form-accordion-panel.module';
import { FormTableComponent } from './modules/form-table/form-table.component';
import { FormTableModule } from './modules/form-table/form-table.module';
import { HRTAGComponent } from './modules/hrtag/hrtag.component';
import { HRTAGModule } from './modules/hrtag/hrtag.module';
import { IconComponent } from './modules/icon/icon.component';
import { IconModule } from './modules/icon/icon.module';
import { ImageWComponent } from './modules/image-w/image-w.component';
import { ImageWModule } from './modules/image-w/image-w.module';
import { ImageComponent } from './modules/image/image.component';
import { ImageModule } from './modules/image/image.module';
import { InputAutoCompComponent } from './modules/input-auto-comp/input-auto-comp.component';
import { InputAutoCompModule } from './modules/input-auto-comp/input-auto-comp.module';
import { InputBackdateComponent } from './modules/input-backdate/input-backdate.component';
import { InputBackdateModule } from './modules/input-backdate/input-backdate.module';
import { InputCbComponent } from './modules/input-cb/input-cb.component';
import { InputCbModule } from './modules/input-cb/input-cb.module';
import { InputCounterComponent } from './modules/input-counter/input-counter.component';
import { InputCounterModule } from './modules/input-counter/input-counter.module';
import { InputDateComponent } from './modules/input-date/input-date.component';
import { InputDateModule } from './modules/input-date/input-date.module';
import { InputDropdownFilterComponent } from './modules/input-dropdown-filter/input-dropdown-filter.component';
import { InputDropdownFilterModule } from './modules/input-dropdown-filter/input-dropdown-filter.module';
import { InputDropdownComponent } from './modules/input-dropdown/input-dropdown.component';
import { InputDropdownModule } from './modules/input-dropdown/input-dropdown.module';
import { InputMultiselectComponent } from './modules/input-multiselect/input-multiselect.component';
import { InputMultiselectModule } from './modules/input-multiselect/input-multiselect.module';
import { InputPasswordComponent } from './modules/input-password/input-password.component';
import { InputPasswordModule } from './modules/input-password/input-password.module';
import { InputRadioCheckComponent } from './modules/input-radio-check/input-radio-check.component';
import { InputRadioCheckModule } from './modules/input-radio-check/input-radio-check.module';
import { InputRadioComponent } from './modules/input-radio/input-radio.component';
import { InputRadioModule } from './modules/input-radio/input-radio.module';
import { InputSwitchComponent } from './modules/input-switch/input-switch.component';
import { InputSwitchModule } from './modules/input-switch/input-switch.module';
import { InputTableComponent } from './modules/input-table/input-table.component';
import { InputTableModule } from './modules/input-table/input-table.module';
import { FCCInputTextComponent } from './modules/input-text/fcc-input-text.component';
import { InputTextModule } from './modules/input-text/fcc-input-text.module';
import { InputTextareaComponent } from './modules/input-textarea/input-textarea.component';
import { InputTextareaModule } from './modules/input-textarea/input-textarea.module';
import { MatCardComponent } from './modules/mat-card/mat-card.component';
import { FCCMatCardModule } from './modules/mat-card/mat-card.module';
import { NarrativeTextareaComponent } from './modules/narrative-textarea/narrative-textarea.component';
import { NarrativeTextareaModule } from './modules/narrative-textarea/narrative-textarea.module';
import { ProgressBarComponent } from './modules/progress-bar/progress-bar.component';
import { FCCProgressBarModule } from './modules/progress-bar/progress-bar.module';
import { ReCaptchaComponent } from './modules/re-captcha/re-captcha.component';
import { ReCaptchaModule } from './modules/re-captcha/re-captcha.module';
import { RoundedButtonComponent } from './modules/rounded-button/rounded-button.component';
import { RoundedButtonModule } from './modules/rounded-button/rounded-button.module';
import { SelectButtonComponent } from './modules/select-button/select-button.component';
import { SelectButtonModule } from './modules/select-button/select-button.module';
import { SpacerComponent } from './modules/spacer/spacer.component';
import { SpacerModule } from './modules/spacer/spacer.module';
import { SummaryTextComponent } from './modules/summary-text/summary-text.component';
import { SummaryTextModule } from './modules/summary-text/summary-text.module';
import { TabComponent } from './modules/tab/tab.component';
import { TabModule } from './modules/tab/tab.module';
import { TemplateComponent } from './modules/template/template.component';
import { TemplateModule } from './modules/template/template.module';
import { TextComparisonComponent } from './modules/text-comparison/text-comparison.component';
import { TextComparisonModule } from './modules/text-comparison/text-comparison.module';
import { TextValueComponent } from './modules/text-value/text-value.component';
import { TextValueModule } from './modules/text-value/text-value.module';
import { TextComponent } from './modules/text/text.component';
import { TextModule } from './modules/text/text.module';
import { FCCTimerComponent } from './modules/timer/fcc-timer.component';
import { FCCTimerModule } from './modules/timer/fcc-timer.module';
import { ViewModeSelectComponent } from './modules/view-mode-select/view-mode-select.component';
import { ViewModeSelectModule } from './modules/view-mode-select/view-mode-select.module';
import { ViewModeComponent } from './modules/view-mode/view-mode.component';
import { ViewModeModule } from './modules/view-mode/view-mode.module';
import { HyperlinkComponent } from './helper-components/hyperlink/hyperlink.component';
import { HyperlinkModule } from './helper-components/hyperlink/hyperlink.module';
import { HighlightTexteditorComponent } from './modules/highlight-texteditor/highlight-texteditor.component';
import { HighlightTextEditorModule } from './modules/highlight-texteditor/highlight-texteditor.module';
import { FccFileViewerModule } from './modules/fcc-file-viewer/fcc-file-viewer.module';
import { InputDateRangeComponent } from './modules/input-date-range/input-date-range.component';
import { InputDateRangeModule } from './modules/input-date-range/input-date-range.module';
import { CardSummaryComponent } from './modules/card-summary/card-summary.component';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { CardSummaryModule } from './modules/card-summary/card-summary.module';
import { ThreeDotsButtonComponent } from './modules/three-dots-button/three-dots-button.component';
import { ThreeDotsButtonModule } from './modules/three-dots-button/threeDots-button.module';
import { ExchangeRateDetailsComponent } from './../../../common/components/exchange-rate-details/exchange-rate-details.component';
import { FccListBoxModule } from './modules/fcc-list-box/fcc-list-box.module';
import { FccListBoxComponent } from './modules/fcc-list-box/fcc-list-box.component';

export const FORM_REGISTERED_MODULES = [
  HyperlinkModule,
  AccordionModule,
  AmendNarrativeTextareaModule,
  AmountModule,
  FCCButtonModule,
  ButtonDivModule,
  CardViewModule,
  CheckboxModule,
  CurrencyModule,
  DialogWindowModule,
  EditTableModule,
  EditorModule,
  ExpansionPanelModule,
  ExpansionPanelTableModule,
  FeesAndChargesModule,
  FCCFileUploadModule,
  FileUploadDragdropModule,
  FormAccordionPanelModule,
  FormTableModule,
  HRTAGModule,
  IconModule,
  ImageModule,
  ImageWModule,
  InputAutoCompModule,
  InputBackdateModule,
  InputCbModule,
  InputDateModule,
  InputDropdownModule,
  InputDropdownFilterModule,
  InputMultiselectModule,
  InputPasswordModule,
  InputRadioModule,
  InputRadioCheckModule,
  InputSwitchModule,
  InputTableModule,
  InputTextModule,
  InputTextareaModule,
  FCCMatCardModule,
  NarrativeTextareaModule,
  FCCProgressBarModule,
  ReCaptchaModule,
  RoundedButtonModule,
  SelectButtonModule,
  SpacerModule,
  SummaryTextModule,
  TabModule,
  TemplateModule,
  TextModule,
  TextValueModule,
  FCCTimerModule,
  ViewModeModule,
  ViewModeSelectModule,
  TextComparisonModule,
  InputCounterModule,
  ExpansionPanelEditTableModule,
  HighlightTextEditorModule,
  CarouselViewModule,
  ThreeDotsButtonModule,
  FccFileViewerModule,
  InputDateRangeModule,
  FccListBoxModule
];

export const FORM_CONTROL_REGISTRATION_CONFIG: IFCCRegistrationConfig[] = [
  {
    type: ROOT_FORM_CONFIG.input.autoComplete,
    component: InputAutoCompComponent,
  },
  {
    type: ROOT_FORM_CONFIG.input.backDate,
    component: InputBackdateComponent,
  },
  {
    type: ROOT_FORM_CONFIG.input.checkbox,
    component: InputCbComponent,
  },
  {
    type: ROOT_FORM_CONFIG.input.date,
    component: InputDateComponent,
  },
  {
    type: ROOT_FORM_CONFIG.input.dateRange,
    component: InputDateRangeComponent,
  },
  {
    type: ROOT_FORM_CONFIG.input.dropdown,
    component: InputDropdownComponent,
  },
  {
    type: ROOT_FORM_CONFIG.input.dropdownFilter,
    component: InputDropdownFilterComponent,
  },
  {
    type: ROOT_FORM_CONFIG.input.multiselect,
    component: InputMultiselectComponent,
  },
  {
    type: ROOT_FORM_CONFIG.input.password,
    component: InputPasswordComponent,
  },
  {
    type: ROOT_FORM_CONFIG.input.radio,
    component: InputRadioComponent,
  },
  {
    type: ROOT_FORM_CONFIG.input.radioCheck,
    component: InputRadioCheckComponent,
  },
  {
    type: ROOT_FORM_CONFIG.input.switch,
    component: InputSwitchComponent,
  },
  {
    type: ROOT_FORM_CONFIG.input.table,
    component: InputTableComponent,
  },
  {
    type: ROOT_FORM_CONFIG.input.text,
    component: FCCInputTextComponent,
  },
  {
    type: ROOT_FORM_CONFIG.input.textArea,
    component: InputTextareaComponent,
  },
  {
    type: ROOT_FORM_CONFIG.upload.dragDrop,
    component: FileUploadDragdropComponent,
  },
  {
    type: ROOT_FORM_CONFIG.upload.upload,
    component: FileUploadComponent,
  },
  {
    type: ROOT_FORM_CONFIG.common.accordion,
    component: AccordionComponent,
  },
  {
    type: ROOT_FORM_CONFIG.common.amount,
    component: FCCAmountComponent,
  },
  {
    type: ROOT_FORM_CONFIG.common.checkbox,
    component: FCCCheckboxComponent,
  },
  {
    type: ROOT_FORM_CONFIG.common.captcha,
    component: ReCaptchaComponent,
  },
  {
    type: ROOT_FORM_CONFIG.common.card,
    component: MatCardComponent,
  },
  {
    type: ROOT_FORM_CONFIG.common.dialog,
    component: DialogWindowComponent,
  },
  {
    type: ROOT_FORM_CONFIG.common.feesCharges,
    component: FeesAndChargesComponent,
  },
  {
    type: ROOT_FORM_CONFIG.common.hrTag,
    component: HRTAGComponent,
  },
  {
    type: ROOT_FORM_CONFIG.common.icon,
    component: IconComponent,
  },
  {
    type: ROOT_FORM_CONFIG.common.progressBar,
    component: ProgressBarComponent,
  },
  {
    type: ROOT_FORM_CONFIG.common.spacer,
    component: SpacerComponent,
  },
  {
    type: ROOT_FORM_CONFIG.common.tab,
    component: TabComponent,
  },
  {
    type: ROOT_FORM_CONFIG.common.text,
    component: TextComponent,
  },
  {
    type: ROOT_FORM_CONFIG.common.template,
    component: TemplateComponent,
  },
  {
    type: ROOT_FORM_CONFIG.common.timer,
    component: FCCTimerComponent,
  },
  {
    type: ROOT_FORM_CONFIG.image.image,
    component: ImageComponent,
  },
  {
    type: ROOT_FORM_CONFIG.image.imageW,
    component: ImageWComponent,
  },
  {
    type: ROOT_FORM_CONFIG.button.button,
    component: ButtonComponent,
  },
  {
    type: ROOT_FORM_CONFIG.button.div,
    component: ButtonDivComponent,
  },
  {
    type: ROOT_FORM_CONFIG.button.rounded,
    component: RoundedButtonComponent,
  },
  {
    type: ROOT_FORM_CONFIG.button.selectButton,
    component: SelectButtonComponent,
  },
  {
    type: ROOT_FORM_CONFIG.viewMode.select,
    component: ViewModeSelectComponent,
  },
  {
    type: ROOT_FORM_CONFIG.viewMode.viewMode,
    component: ViewModeComponent,
  },
  {
    type: ROOT_FORM_CONFIG.textarea.amendNarrative,
    component: AmendNarrativeTextareaComponent,
  },
  {
    type: ROOT_FORM_CONFIG.textarea.narrative,
    component: NarrativeTextareaComponent,
  },
  {
    type: ROOT_FORM_CONFIG.table.edit,
    component: EditTableComponent,
  },
  {
    type: ROOT_FORM_CONFIG.common.exchangeRate,
    component: ExchangeRateDetailsComponent,
  },

  {
   type: ROOT_FORM_CONFIG.common.carouselView,
   component: CarouselViewComponent,
  },
  {
    type: ROOT_FORM_CONFIG.common.threeDotsButton,
    component: ThreeDotsButtonComponent,
   },
  {
    type: ROOT_FORM_CONFIG.table.form,
    component: FormTableComponent,
  },
  {
    type: ROOT_FORM_CONFIG.expansionPanel.expansionPanel,
    component: ExpansionPanelComponent,
  },
  {
    type: ROOT_FORM_CONFIG.expansionPanel.formAccordian,
    component: FormAccordionPanelComponent,
  },
  {
    type: ROOT_FORM_CONFIG.expansionPanel.table,
    component: ExpansionPanelTableComponent,
  },
  {
    type: ROOT_FORM_CONFIG.common.currency,
    component: CurrencyComponent,
  },
  {
    type: ROOT_FORM_CONFIG.common.textValue,
    component: TextValueComponent,
  },
  {
    type: ROOT_FORM_CONFIG.common.cardView,
    component: CardViewComponent,
  },
  {
    type: ROOT_FORM_CONFIG.common.editor,
    component: EditorComponent,
  },
  {
    type: ROOT_FORM_CONFIG.common.summaryText,
    component: SummaryTextComponent,
  },
  {
    type: ROOT_FORM_CONFIG.common.AmendComparisonText,
    component: TextComparisonComponent,
  },
  {
    type: ROOT_FORM_CONFIG.common.calendarDate,
    component: InputCounterComponent,
  },
  {
    type: ROOT_FORM_CONFIG.expansionPanel.editTable,
    component: ExpansionPanelEditTableComponent,
  },
  {
    type: ROOT_FORM_CONFIG.common.hyperlink,
    component: HyperlinkComponent,
  },
  {
    type: ROOT_FORM_CONFIG.textarea.highlightEditor,
    component: HighlightTexteditorComponent,
  },
  {
    type: ROOT_FORM_CONFIG.common.fileViewer,
    component: FccFileViewerComponent,
  },
  {
  type: ROOT_FORM_CONFIG.expansionPanel.editFormTable,
  component: ExpansionPanelEditFormTableComponent,
  },
  {
    type: ROOT_FORM_CONFIG.common.cardSummary,
    component: CardSummaryComponent,
  },
  {
    type: ROOT_FORM_CONFIG.common.listBox,
    component: FccListBoxComponent,
  },
];
