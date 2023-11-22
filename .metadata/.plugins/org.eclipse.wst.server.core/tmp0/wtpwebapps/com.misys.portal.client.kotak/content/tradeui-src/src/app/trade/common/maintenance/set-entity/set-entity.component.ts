import { Product } from '../../../../common/model/product.model';
import { Component, OnInit, ViewChild } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ConfirmationService, DialogService } from 'primeng';
import { CommonService } from '../../../../common/services/common.service';
import { Constants } from '../../../../common/constants';
import { ReauthDialogComponent } from '../../../../common/components/reauth-dialog/reauth-dialog.component';
import { ResponseService } from '../../../../common/services/response.service';
import { ReauthService } from '../../../../common/services/reauth.service';
import { TradeMaintenanceService } from '../../../../trade/common/maintenance/services/trade-maintenance.service';
import { CommonDataService } from '../../../..//common/services/common-data.service';
import { URLConstants } from '../../../../common/urlConstants';

@Component({
  selector: 'fcc-trade-set-entity',
  templateUrl: './set-entity.component.html',
  styleUrls: ['./set-entity.component.scss']
})
export class SetEntityComponent implements OnInit {

  public setEntityForm: UntypedFormGroup;
  public jsonContent;
  entityProduct: Product;
  responseMessage: object;
  public enableReauthPopup = false;
  reauthType: string;
  actionCode = '';

  @ViewChild(ReauthDialogComponent) reauthDialogComponent: ReauthDialogComponent;

  constructor(protected fb: UntypedFormBuilder, public commonDataService: CommonDataService,
              protected activatedRoute: ActivatedRoute, protected translate: TranslateService,
              protected confirmationService: ConfirmationService, protected router: Router,
              public dialogService: DialogService, protected commonService: CommonService,
              protected responseService: ResponseService, protected reauthService: ReauthService,
              protected setEntityService: TradeMaintenanceService) { }

  ngOnInit() {
    this.actionCode = window[`ACTION_CODE`];
    let viewRefId;
    this.activatedRoute.params.subscribe(paramsId => {
      viewRefId = paramsId.refId;
    });
    this.entityProduct = new Product();
    // Fetch Master details to display values
    this.commonService.getMasterDetails(viewRefId, this.commonDataService.getProductCode(), this.actionCode).subscribe(data => {
      this.jsonContent = data.masterDetails as string[];
    });
    this.createForm();

  }

  createForm() {
    return this.setEntityForm = this.fb.group({});
  }

  openDialog(operation: string) {

    let message = '';
    if (operation === 'submit') {
      this.translate.get('CONFIRMATION_SUBMIT').subscribe((value: string) => {
        message = value;
      });
    } else if (operation === 'cancel' || operation === 'help') {
      this.translate.get('CONFIRMATION_CANCEL').subscribe((value: string) => {
        message = value;
      });
    }
    this.confirmationService.confirm({
      message,
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        if (operation === 'submit') {
          if (this.commonService.getReauthEnabled()) {
            this.enableReauthPopup = this.commonService.getReauthEnabled();
            this.showReauthPopup(Constants.OPERATION_SUBMIT);
          } else {
            this.onSubmit();
          }
        } else if (operation === 'cancel') {
          this.onCancel();
        } else if (operation === 'help') {
          this.router.navigate(['']);
        }
      },
      reject: () => {
      }
    });
  }

  handleEvents(operation) {
    if (operation === Constants.OPERATION_SUBMIT) {
      if (this.commonService.getReauthEnabled()) {
        this.enableReauthPopup = this.commonService.getReauthEnabled();
        this.showReauthPopup(Constants.OPERATION_SUBMIT);
      } else {
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
    this.transformToIssuedUndertaking();
    this.enableReauthPopup = this.commonService.getReauthEnabled();
    this.setEntityService.updateEntity(this.entityProduct).subscribe(
      data => {
        this.responseMessage = data.message;
        this.responseService.setResponseMessage(data.message);
        const response = data.response;
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
  }

  transformToIssuedUndertaking() {
    this.entityProduct.productCode = this.commonDataService.getProductCode();
    if (this.commonDataService.getProductCode() === Constants.PRODUCT_CODE_IU) {
      this.entityProduct.entity = this.setEntityForm.controls.applicantDetailsForm.get('entity').value;
    } else {
      this.entityProduct.entity = this.setEntityForm.controls.beneficiaryDetailsForm.get('entity').value;
    }
    this.entityProduct.brchCode = this.jsonContent.brchCode;
    this.entityProduct.companyId = this.jsonContent.companyId;
    this.entityProduct.companyName = this.jsonContent.companyName;
    this.entityProduct.refId = this.jsonContent.refId;
  }

  addToForm(name: string, form: UntypedFormGroup) {
    this.setEntityForm.setControl(name, form);
  }

  onReauthSubmit() {
    this.entityProduct.reauthPassword = this.setEntityForm.controls.reauthForm.get('reauthPassword').value;
    this.onSubmit();
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
