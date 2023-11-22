import { Component, Input, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { FccGlobalConstant } from '../../../../../common/core/fcc-global-constants';
import { CommonService } from '../../../../../common/services/common.service';
import { FccGlobalConstantService } from '../../../../../common/core/fcc-global-constant.service';
import { FCCFormGroup } from '../../../../../base/model/fcc-control.model';
import { TemplateData } from '../model/template-data';

@Component({
  selector: 'app-payments-bulk-filetemplate-download',
  templateUrl: './payments-bulk-filetemplate-download.component.html',
  styleUrls: ['./payments-bulk-filetemplate-download.component.scss']
})
export class PaymentsBulkFiletemplateDownloadComponent implements OnInit {


  module = ``;
  mode: string;
  form: FCCFormGroup;
  @Input() parentForm: FCCFormGroup;
  @Input() data;
  @Input() controlName: string;
  contextPath: string;
  templateData: TemplateData[] = [];
  subscriptions: Subscription[] = [];
  templateType: string[];

  constructor(protected commonService: CommonService,
    protected fccGlobalConstantService: FccGlobalConstantService,
    protected translate: TranslateService) { }

  ngOnInit(): void {
    this.initializeFormGroup();
    this.contextPath = this.commonService.getContextPath();
    this.mode = this.commonService.getQueryParametersFromKey(
      FccGlobalConstant.MODE);

  }

  initializeFormGroup(): void {
    const form = this.parentForm.controls[this.controlName];
    if (form !== null) {
      this.form = form as FCCFormGroup;
    }
    const control = this.form['params']['formAccordionPanels'];
    this.createTemplateList(control);
  }

  createTemplateList(control): void {
    control.forEach(element => {
      const data = element.panelData;
      const templatePath = data[FccGlobalConstant.PAYMENTS_TEMPLATE_DETAILS].templateIconPath;
      this.templateType = data[FccGlobalConstant.PAYMENTS_TEMPLATE_DETAILS].templateType;
      const templateName = data[FccGlobalConstant.PAYMENTS_TEMPLATE_DETAILS].templateName;

      for (let i = 0; i < templatePath.length; i++) {
        this.templateData.push({
          path: templatePath[i],
          type: this.templateType[i],
          name: templateName[i]
        });
      }
    });
  }

  keyPressRoute(event: Event, data: TemplateData): void {
    const fnName = `exportTemplate`;
    const fn = this[fnName];
    if (fn && (typeof fn === 'function')) {
      this[fnName](data);
    }
  }

  exportTemplate(data: TemplateData): void {
    const fileName = data.name;
    this.subscriptions.push(
      this.commonService.downloadTemplate(fileName).subscribe(
        response => {
          let fileType;
          if (response.type) {
            fileType = response.type;
          } else {
            fileType = 'application/octet-stream';
          }
          const newBlob = new Blob([response.body], { type: fileType });

          // IE doesn't allow using a blob object directly as link href
          // instead it is necessary to use msSaveOrOpenBlob
          if (window.navigator && (window.navigator as any).msSaveOrOpenBlob) {
            (window.navigator as any).msSaveOrOpenBlob(newBlob, fileName);
            return;
          }

          const data = window.URL.createObjectURL(newBlob);
          const link = document.createElement('a');
          link.href = data;
          link.download = fileName;
          // this is necessary as link.click() does not work on the latest firefox
          link.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }));

          window.URL.revokeObjectURL(data);
          link.remove();
        }));
  }


  ngOnDestroy(): void {
    this.parentForm.controls[this.controlName] = this.form;
    this.subscriptions.forEach(e => e.unsubscribe);
  }
}
