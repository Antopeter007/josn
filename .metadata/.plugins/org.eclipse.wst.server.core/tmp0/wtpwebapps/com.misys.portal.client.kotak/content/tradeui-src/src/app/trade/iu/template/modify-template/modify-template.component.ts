import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ConfirmationService } from 'primeng/api';
import { TemplateIssuedUndertakingRequest } from '../../common/model/TemplateIssuedUndertakingRequest';
import { IUCommonDataService } from '../../common/service/iuCommonData.service';
import { IUService } from '../../common/service/iu.service';
import { Constants } from '../../../../common/constants';
import { ResponseService } from '../../../../common/services/response.service';
import { validateSwiftCharSet } from '../../../../common/validators/common-validator';
import { URLConstants } from '../../../../common//urlConstants';
import { CommonService } from '../../../../common/services/common.service';
import { AuditService } from '../../../../common/services/audit.service';




@Component({
  selector: 'fcc-iu-modify-template',
  templateUrl: './modify-template.component.html',
  styleUrls: ['./modify-template.component.scss']
})
export class ModifyTemplateComponent implements OnInit {

  public bgRecord;
  modifyTemplate: UntypedFormGroup;
  contextPath: string;
  responseMessage: object;
  templateIssuedUndertaking: TemplateIssuedUndertakingRequest;
  rawValuesForm: UntypedFormGroup;
  showTemplate: boolean;

  constructor(protected fb: UntypedFormBuilder, protected confirmationService: ConfirmationService,
              protected translate: TranslateService, protected router: Router, protected iuService: IUService,
              protected activatedRoute: ActivatedRoute, protected responseService: ResponseService,
              public commonDataService: IUCommonDataService, public commonService: CommonService, public auditService: AuditService) { }

  ngOnInit() {
    let templateid;
    let option;
    let operation;
    let subproductcode;
    this.contextPath = window[`CONTEXT_PATH`];
    this.activatedRoute.params.subscribe(paramsId => {
      templateid = paramsId.templateid;
      option = paramsId.option;
      operation = paramsId.operation;
      subproductcode = paramsId.subproductcode;
    });
    this.showTemplate = false;
    if (operation === Constants.OPERATION_MODIFY_TEMPLATE) {
      this.modifyTemplate = this.fb.group({
        brchCode: '',
        companyId: '',
        templateId: '',
        templateDescription: ['', [Validators.maxLength(Constants.LENGTH_200), Validators.required,
                                   validateSwiftCharSet(Constants.X_CHAR)]],
        productCode: '',
        subProductCode: '',
      });
      this.showTemplate = true;
      this.iuService.getIuModifyTemplateDetails(templateid, this.commonDataService.getProductCode(),
      subproductcode, option).subscribe(data => {
        this.bgRecord = data.bg_tnx_record as string[];
        this.modifyTemplate.patchValue({
          brchCode:  this.bgRecord[`brchCode`],
          companyId:  this.bgRecord[`companyId`] ,
          templateId: this.bgRecord[`templateId`],
          templateDescription: this.bgRecord[`templateDescription`],
          productCode: this.commonDataService.getProductCode(),
          subProductCode: this.bgRecord[`subProductCode`]
        });
      });
    } else if (operation === Constants.OPERATION_DELETE_TEMPLATE) {
      this.iuService.deleteTemplate(templateid, this.commonDataService.getProductCode(),
      subproductcode, option).subscribe(data => {
        this.responseMessage = data.message;
        this.responseService.setResponseMessage(data.message);
        this.responseService.setOption(Constants.OPERATION_DELETE_TEMPLATE);
        this.router.navigate(['submitOrSave']);
      });
    }
  }

  onSubmit() {
    if (this.modifyTemplate.valid) {
      this.transformToTemplateIssuedUndertaking();
      this.iuService.saveOrSubmitModifiedIUTemplate(this.contextPath + URLConstants.IU_SAVE_MODIFIED_TEMPLATE,
        this.templateIssuedUndertaking).subscribe(
        data => {
          this.responseMessage = data.message;
          this.responseService.setResponseMessage(data.message);
          this.responseService.setTemplateId(data.templateId);
          this.responseService.setOption(Constants.OPTION_SAVE_TEMPLATE);
          this.router.navigate(['submitOrSave']);
        }
      );
    }  else {
      this.validateAllFields(this.modifyTemplate);
    }
  }

  transformToTemplateIssuedUndertaking() {
    this.rawValuesForm = new UntypedFormGroup({});
    Object.assign(this.rawValuesForm, this.modifyTemplate.getRawValue());
    this.templateIssuedUndertaking = new TemplateIssuedUndertakingRequest();
    this.templateIssuedUndertaking.brchCode = this.rawValuesForm[`brchCode`];
    this.templateIssuedUndertaking.companyId = this.rawValuesForm[`companyId`];
    this.templateIssuedUndertaking.templateId = this.rawValuesForm[`templateId`];
    this.templateIssuedUndertaking.subProductCode = this.rawValuesForm[`subProductCode`];
    this.templateIssuedUndertaking.productCode = this.rawValuesForm[`productCode`];
    this.templateIssuedUndertaking.templateDescription = this.rawValuesForm[`templateDescription`];
  }

  validateAllFields(mainForm: UntypedFormGroup) {
    Object.keys(mainForm.controls).forEach(field => {
      const control = mainForm.get(field);
      if (control instanceof UntypedFormControl) {
        if (!control.disabled) {
          control.markAsTouched({ onlySelf: true });
        }
      } else if (control instanceof UntypedFormGroup) {
          this.validateAllFields(control);
      }
    });
  }

  onCancel() {
    const host = window.location.origin;
    const url = host + this.commonService.getBaseServletUrl() + Constants.IU_LANDING_SCREEN;
    window.location.replace(url);
    this.auditService.audit().subscribe(
      data => {
      }
    );
  }

  closeWindow() {
    window.close();
  }

  openHelp() {
    const host = window.location.origin;
    let url = host + this.commonService.getBaseServletUrl();
    const userLanguage = this.commonService.getUserLanguage();
    const accessKey = Constants.HELP_IU_INITIATION;
    url += URLConstants.ONLINE_HELP;
    url += `/?helplanguage=${userLanguage}`;
    url += `&accesskey=${accessKey}`;
    const myWindow = window.open(url, Constants.TRANSACTION_POPUP, 'width=800,height=500,resizable=yes,scrollbars=yes');
    myWindow.focus();
  }

  handleEvents(operation) {
    if (operation === Constants.OPERATION_SUBMIT) {
      this.onSubmit();
    } else if (operation === Constants.OPERATION_CANCEL) {
      this.onCancel();
    } else if (operation === Constants.OPERATION_HELP) {
      this.openHelp();
    }
  }

}
