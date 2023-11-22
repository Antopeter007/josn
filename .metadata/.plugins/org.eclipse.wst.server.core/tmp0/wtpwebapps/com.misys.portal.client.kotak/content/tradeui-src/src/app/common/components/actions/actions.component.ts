import { Constants } from './../../../common/constants';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ConfirmationService } from 'primeng/api';
import { UntypedFormGroup } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { CommonService } from '../../services/common.service';

@Component({
  selector: 'fcc-common-actions',
  templateUrl: './actions.component.html',
  styleUrls: ['./actions.component.scss']
})
export class ActionsComponent implements OnInit {

  imagePath: string;
  actions: UntypedFormGroup;
  @Output() handleEvents = new EventEmitter<any>();
  public operation: string;
  @Input() showSave = false;
  @Input() showTemplate = false;
  @Input() showReturn = false;
  @Input() showPreview = false;
  @Input() showExport = false;
  @Input() showPrint = false;
  @Input() showClose = false;
  @Input() isFooter = false;
  @Input() showSubmit = true;
  @Input() showCancel = true;
  @Input() showHelp = true;
  @Input() showTask = false;
  @Input() public bgRecord;
  public saveButtonId = 'header_save';
  public submitButtonId = 'header_submit';
  public cancelButtonId = 'header_cancel';
  public helpButtonId = 'header_help';
  public exportButtonId = 'header_export';
  public printButtonId = 'header_print';
  public closeButtonId = 'header_close';
  public templateButtonId = 'header_template';
  public returnButtonId = 'header_return';
  public previewButtonId = 'header_preview';
  public operationSave = Constants.OPERATION_SAVE;
  public operationSubmit = Constants.OPERATION_SUBMIT;
  public operationCancel = Constants.OPERATION_CANCEL;
  public operationTemplate = Constants.OPERATION_TEMPLATE;
  public operationReturn = Constants.OPERATION_RETURN;
  public showProgressBar = false;
  public displayMessage: string;

  constructor(public confirmationService: ConfirmationService, public translate: TranslateService,
              public commonService: CommonService) { }

  ngOnInit() {
    if (this.isFooter) {
      this.saveButtonId = 'footer_save';
      this.submitButtonId = 'footer_submit';
      this.cancelButtonId = 'footer_cancel';
      this.helpButtonId = 'footer_help';
      this.exportButtonId = 'footer_export';
      this.printButtonId = 'footer_print';
      this.closeButtonId = 'footer_close';
      this.templateButtonId = 'footer_template';
      this.returnButtonId = 'footer_return';
      this.previewButtonId = 'footer_preview';
    }
    this.imagePath = this.commonService.getImagePath();
  }

  openDialog(operation: string) {
    let message = '';
    this.operation = operation;
    if (operation === this.operationSave) {
      this.translate.get('CONFIRMATION_SAVE').subscribe((value: string) => {
        message =  value;
       });
    } else if (operation === this.operationSubmit) {
      this.translate.get('CONFIRMATION_SUBMIT').subscribe((value: string) => {
        message =  value;
       });
    } else if (operation === this.operationCancel) {
      this.translate.get('CONFIRMATION_CANCEL').subscribe((value: string) => {
        message =  value;
       });
    } else if (operation === this.operationReturn) {
      this.translate.get('CONFIRMATION_RETURN').subscribe((value: string) => {
        message =  value;
       });
    } else if (operation === this.operationTemplate) {
      this.translate.get('CONFIRMATION_TEMPLATE').subscribe((value: string) => {
        message =  value;
       });
    } else if (operation === Constants.OPERATION_OVERWRITE_TEMPLATE) {
      this.translate.get('nonUniqueTemplateIDError').subscribe((value: string) => {
        message =  value;
       });
    }
    this.confirmationService.confirm({
      message,
      header: 'Confirmation',
      icon: 'pi pi-info-circle',
      accept: () => {
        this.onAccept();
      },
      reject: () => {

      }
  });
  }

  onAccept() {
    this.handleEvents.emit(this.operation);
  }

  openPreview() {
    this.handleEvents.emit(Constants.OPERATION_PREVIEW);
  }

  generatePdf() {
    this.handleEvents.emit(Constants.OPERATION_EXPORT);
  }

  onPrint() {
    window.print();
  }

  onClose() {
    window.close();
  }

  openHelp() {
    this.handleEvents.emit(Constants.OPERATION_HELP);
  }

}
