import { Component, Input, OnInit } from '@angular/core';
import { FccGlobalConstantService } from '../../../../../app/common/core/fcc-global-constant.service';
import { FCCFormGroup } from '../../../../../app/base/model/fcc-control.model';
import { CommonService } from '../../../../../app/common/services/common.service';
import { FccGlobalConstant } from '../../../../../app/common/core/fcc-global-constants';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-bene-bulk-filetemplate-download',
  templateUrl: './bene-bulk-filetemplate-download.component.html',
  styleUrls: ['./bene-bulk-filetemplate-download.component.scss']
})
export class BeneBulkFiletemplateDownloadComponent implements OnInit {

  
  module = ``;
  mode: any;
  form: FCCFormGroup;
  @Input() parentForm: FCCFormGroup;
  @Input() data;
  @Input() controlName;
  contextPath: string;
  templateData: any[] = [];
  templateDataDownload: any;
  private tableHeadersCSV: any[] = [];
  subscriptions: Subscription[] = [];
  arr :any;
  templateType: any;

  constructor(protected commonService: CommonService,
    protected fccGlobalConstantService: FccGlobalConstantService,
    protected translate: TranslateService) { }

  ngOnInit(): void {
    this.initializeFormGroup();
    this.contextPath = this.commonService.getContextPath();
    this.mode = this.commonService.getQueryParametersFromKey(
      FccGlobalConstant.MODE);
    
  }

  initializeFormGroup() {
    const form = this.parentForm.controls[this.controlName];
    if (form !== null) {
      this.form = form as FCCFormGroup;
    }
    const control = this.form['params']['formAccordionPanels'];
    this.createTemplateList(control);
  }

  createTemplateList(control : any) {
    control.forEach(element => {
      const data = element.panelData;
      const templatePath = data[FccGlobalConstant.BENE_TEMPLATE_DETAILS].templateIconPath;
      this.templateType = data[FccGlobalConstant.BENE_TEMPLATE_DETAILS].templateType;
      const templateName = data[FccGlobalConstant.BENE_TEMPLATE_DETAILS].templateName;

      let i;
      for (i =0; i< templatePath.length;i++) {
        this.templateData.push({
          path: templatePath[i],
          type: this.templateType[i],
          name: templateName[i]
        });
      }
    });
  }

  keyPressRoute(event, data) {
    const fnName = `exportTemplate`;
    const fn = this[fnName];
    if (fn && (typeof fn === 'function')) {
      this[fnName](data);
    }
  }

  exportTemplate(data) {
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
        if (window.navigator && window.navigator.msSaveOrOpenBlob) {
          window.navigator.msSaveOrOpenBlob(newBlob, fileName);
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


  ngOnDestroy() {
    this.parentForm.controls[this.controlName] = this.form;
  }
}
