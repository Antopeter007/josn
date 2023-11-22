import { Component, OnInit, ViewChild } from '@angular/core';
import { UntypedFormGroup, UntypedFormControl, UntypedFormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ReauthDialogComponent } from '../../../../common/components/reauth-dialog/reauth-dialog.component';
import { ResponseService } from '../../../../common/services/response.service';
import { Constants } from '../../../../common/constants';
import { AuditService } from '../../../../common/services/audit.service';
import { TranslateService } from '@ngx-translate/core';
import { ConfirmationService } from 'primeng/api';
import { CommonService } from '../../../../common/services/common.service';
import { ReauthService } from '../../../../common/services/reauth.service';
import { TradeCustReference } from '../../../../trade/common/maintenance/model/trade.custReference.model';
import { TradeMaintenanceService } from '../../../../trade/common/maintenance/services/trade-maintenance.service';
import { CommonDataService } from '../../../../common/services/common-data.service';
import { URLConstants } from '../../../../common/urlConstants';

@Component({
  selector: 'fcc-trade-set-reference',
  templateUrl: './set-reference.component.html',
  styleUrls: ['./set-reference.component.scss']
})

export class SetReferenceComponent implements OnInit {

  public customerRefForm: UntypedFormGroup;
  public jsonContent;
  public showForm = true;
  refId: string;
  custRefId: string;
  responseMessage: object;
  public enableReauthPopup = false;
  public operation: string;
  reauthType: string;
  custReference: TradeCustReference;
  actionCode = '';


  @ViewChild(ReauthDialogComponent) reauthDialogComponent: ReauthDialogComponent;

  constructor(protected fb: UntypedFormBuilder, protected maintenanceService: TradeMaintenanceService,
              protected activatedRoute: ActivatedRoute, protected commonService: CommonService,
              protected reauthService: ReauthService, protected confirmationService: ConfirmationService,
              protected translate: TranslateService, protected router: Router,
              protected responseService: ResponseService, protected auditService: AuditService,
              public commonDataService: CommonDataService) { }

  ngOnInit() {
    this.actionCode = window[`ACTION_CODE`];
    let viewRefId;
    this.activatedRoute.params.subscribe(paramsId => {
      viewRefId = paramsId.refId;
    });
    this.custReference = new TradeCustReference();
    this.commonService.getMasterDetails(viewRefId, this.commonDataService.getProductCode(), this.actionCode).subscribe(data => {
      this.jsonContent = data.masterDetails as string[];
    });

    this.createMainForm();
  }

  createMainForm() {
    this.customerRefForm = this.fb.group({});
  }

  /**
   * After a form is initialized, we link it to our main form
   */
  addToForm(name: string, form: UntypedFormGroup) {
    this.customerRefForm.setControl(name, form);
  }

  handleEvents(operation) {
    if (operation === Constants.OPERATION_SUBMIT) {
      this.validateForm();
      if (this.customerRefForm.valid && this.commonService.getReauthEnabled()) {
        this.enableReauthPopup = this.commonService.getReauthEnabled();
        this.showReauthPopup(Constants.OPERATION_SUBMIT);
      } else if (this.customerRefForm.valid) {
        this.onSubmit();
      }
    }  else if (operation === Constants.OPERATION_CANCEL) {
      this.onCancel();
    } else if (operation === Constants.OPERATION_HELP) {
      this.openHelp();
    }
  }
  showReauthPopup(operation) {

    const entity = this.jsonContent.entity;
    const currency = this.jsonContent.tnx_cur_code;
    const subProdCode = this.jsonContent.subProductCode;
    const reauthParams = new Map();
    reauthParams.set('productCode', this.commonDataService.getProductCode());
    reauthParams.set('subProductCode', subProdCode);
    reauthParams.set('entity', entity);
    reauthParams.set('currency', currency);
    reauthParams.set('amount', '');
    reauthParams.set('es_field1', '');
    reauthParams.set('es_field2', '');
    reauthParams.set('operation', operation);
    reauthParams.set('mode', '');

    // Call Reauth service to get the re-auth type
    this.reauthService.getReauthType(reauthParams).subscribe(
      data => {
        this.reauthType = data.response;
        if (this.reauthType === 'PASSWORD') {
          this.reauthDialogComponent.enableReauthPopup = true;
          // setting reauthPassword to '' as it has to get cleared when user clicks on submit after reauthentication failure
          this.reauthDialogComponent.reauthForm.get('reauthPassword').setValue('');
        } else if (this.reauthType === 'ERROR') {
          this.reauthDialogComponent.enableErrorPopup = true;
        } else {
          this.enableReauthPopup = false;
          this.onSubmit();
        }
      });
  }
  onSubmit() {
    if (this.customerRefForm.valid) {

      this.transformTocustReference();
      this.showForm = false;
      this.maintenanceService.submitCustRef(this.custReference).subscribe(
        data => {
          this.responseMessage = data.message;
          const response = data.response;
          this.responseService.setResponseMessage(data.message);
          this.responseService.setRefId(data.refId);
          this.responseService.setTnxId(data.tnxId);
          this.responseService.setTnxType(data.tnxTypeCode);
          if (this.enableReauthPopup) {
            this.reauthDialogComponent.onReauthSubmitCompletion(response);
            if (response === Constants.SUCCESS) {
              this.router.navigate(['submitOrSave']);
            }
          } else {
            this.router.navigate(['submitOrSave']);
          }
        }
      );
    } else {
      this.validateAllFields(this.customerRefForm);
    }
  }

  transformTocustReference() {
    if (this.commonDataService.getProductCode() === Constants.PRODUCT_CODE_IU) {
      this.custReference.custRefId = this.customerRefForm.controls.applicantDetailsForm.get('applicantCustReference').value;
    } else {
      this.custReference.custRefId = this.customerRefForm.controls.beneficiaryDetailsForm.get('cust_reference_id').value;
    }
    this.custReference.brchCode = this.jsonContent.brchCode;
    this.custReference.companyId = this.jsonContent.companyId;
    this.custReference.companyName = this.jsonContent.companyName;
    this.custReference.refId = this.jsonContent.refId;
    this.custReference.swiftBicCodeRegexValue = this.commonService.getSwiftBicCodeRegexValue();
    this.custReference.tnxId = this.jsonContent.tnxId;
    this.custReference.tnxAmt = this.jsonContent.tnxAmt;
    this.custReference.tnxCurCode = this.jsonContent.tnxCurCode;
    this.custReference.boRefId = this.jsonContent.boRefId;
    this.custReference.productCode = this.commonDataService.getProductCode();

  }

  validateAllFields(mainForm: UntypedFormGroup) {
    Object.keys(mainForm.controls).forEach(field => {
      const control = mainForm.get(field);
      if (control instanceof UntypedFormControl) {
        control.markAsTouched({ onlySelf: true });
      } else if (control instanceof UntypedFormGroup) {
        this.validateAllFields(control);
      }
    });
  }

  validateForm() {
    this.validateAllFields(this.customerRefForm);
  }
  onCancel() {
    const host = window.location.origin;
    let url = host + this.commonService.getBaseServletUrl();

    if (this.commonDataService.getProductCode() === Constants.PRODUCT_CODE_IU) {
      url += Constants.IU_LANDING_SCREEN;
    } else if (this.commonDataService.getProductCode() === Constants.PRODUCT_CODE_RU) {
      url += Constants.RU_LANDING_SCREEN;
    }
    window.location.replace(url);
    this.auditService.audit().subscribe(
      data => {
      }
    );
  }

  onReauthSubmit() {
    this.custReference.reauthPassword = this.customerRefForm.controls.reauthForm.get('reauthPassword').value;
    this.onSubmit();
  }

  openHelp() {
    const host = window.location.origin;
    let url = host + this.commonService.getBaseServletUrl();
    const userLanguage = this.commonService.getUserLanguage();
    let accessKey;
    if (this.commonDataService.getProductCode() === Constants.PRODUCT_CODE_IU) {
      accessKey = Constants.HELP_IU_MAINTENANCE;
    } else if (this.commonDataService.getProductCode() === Constants.PRODUCT_CODE_RU) {
      accessKey = Constants.HELP_RU_MAINTENANCE;
    }
    url += URLConstants.ONLINE_HELP;
    url += `/?helplanguage=${userLanguage}`;
    url += `&accesskey=${accessKey}`;
    const myWindow = window.open(url, Constants.TRANSACTION_POPUP, 'width=800,height=500,resizable=yes,scrollbars=yes');
    myWindow.focus();
  }

}
