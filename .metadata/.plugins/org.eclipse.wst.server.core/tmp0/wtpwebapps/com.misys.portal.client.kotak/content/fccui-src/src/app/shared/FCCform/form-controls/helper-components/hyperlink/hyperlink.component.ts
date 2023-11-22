import { Component, OnInit, AfterViewInit, EventEmitter, Output, Input } from '@angular/core';
import { FCCFormGroup, FCCMVFormControl } from '../../../../../base/model/fcc-control.model';
import { IDataEmittterModel, IUpdateFccBase } from '../../form-control-resolver/form-control-resolver.model';
import { FCCBase } from '../../../../../base/model/fcc-base';
import { CommonService } from '../../../../../common/services/common.service';
import { TranslateService } from '@ngx-translate/core';
import { FccGlobalConstantService } from '../../../../../common/core/fcc-global-constant.service';
import { CodeData } from '../../../../../common/model/codeData';
import { FccGlobalConstant } from '../../../../../common/core/fcc-global-constants';
import { FccGlobalConfiguration } from '../../../../../common/core/fcc-global-configuration';
@Component({
  selector: 'app-hyperlink',
  templateUrl: './hyperlink.component.html',
  styleUrls: ['./hyperlink.component.scss']
})
export class HyperlinkComponent extends FCCBase
implements OnInit, AfterViewInit, IUpdateFccBase {

  @Input() control!: FCCMVFormControl;
  @Input() form!: FCCFormGroup;
  @Input() mode!: string;
  @Input() hostComponentData!: any | null;
  @Output() controlDataEmitter: EventEmitter<IDataEmittterModel> =
    new EventEmitter<IDataEmittterModel>();
  @Input() public controlData: any;
  compData = new Map<string, any>();
  linkInfo: any;
  targetValue: any;
  urlName: any;
  position: any;
  source: any;
  codeId: any;
  link: any;
  propertyKey: any;
  contextPath: any;
  codeData = new CodeData();
  dir = localStorage.getItem('langDir');
  classValue: any;
  displayDialog = false;
  interestRateUrl: any;
  lang: any;
  splitUrl: any;
  updatedUrl: any;
  lastElem: any;

  constructor(protected commonService: CommonService, protected translateService: TranslateService,
              protected fccGlobalConstantService: FccGlobalConstantService, protected fccGlobalConfiguration: FccGlobalConfiguration, ) {
    super();
   }

  ngOnInit(): void {
    this.contextPath = this.fccGlobalConstantService.contextPath;
    this.lang = localStorage.getItem('language') !== null ? localStorage.getItem('language') : '';
    if (this.commonService.isnonEMptyString(this.controlData)) {
        this.linkInfo = `${this.translateService.instant(this.controlData.name)}`;
        this.position = this.controlData.position;
        this.targetValue = this.controlData.target === 'window' ? '_blank' : '_self';
        this.source = this.controlData.source;
        this.codeId = this.controlData.codeID;
        this.link = this.controlData.link;
        this.propertyKey = this.controlData.propertyName;
     }
  }

  fetchUrl(){
      switch (this.source) {
        case 'codeData':
           this.loadCodeData();
           break;
        case 'property':
           this.loadConfiguration();
           break;
        case 'external':
           this.displayDialog = true;
           break;
        default:
        break;
  }
}


  loadCodeData() {
    this.codeData.tnxTypeCode = this.commonService.getQueryParametersFromKey(FccGlobalConstant.TNX_TYPE_CODE);
    this.codeData.mode = this.commonService.getQueryParametersFromKey(FccGlobalConstant.MODE);
    this.codeData.productCode = this.commonService.getQueryParametersFromKey(FccGlobalConstant.PRODUCT);
    this.codeData.subProductCode = this.commonService.getQueryParametersFromKey(FccGlobalConstant.SUB_PRODUCT_CODE);
    this.codeData.language = this.lang;
    this.codeData.codeId = this.codeId;
    this.commonService.getCodeDataDetails(this.codeData).subscribe(response => {
        response.body.items.forEach(responseValue => {
          this.urlName = this.contextPath + responseValue.longDesc;
          window.open(this.urlName, this.targetValue);
       });
      });
    }

  loadConfiguration() {
    const property = this.propertyKey;
    let keyNotFoundList = [];
    keyNotFoundList = this.fccGlobalConfiguration.configurationValuesCheck(property);
    if (keyNotFoundList.length !== 0) {
       this.commonService.getConfiguredValues(keyNotFoundList.toString()).subscribe(response => {
         this.interestRateUrl = this.formatUrl(response[this.propertyKey]);
         this.urlName = this.contextPath + this.interestRateUrl;
         window.open(this.urlName, this.targetValue);
       });
     }
  }

  formatUrl(responseValue) {
      this.splitUrl = responseValue.split('/');
      this.lastElem = this.splitUrl.pop().split('.');
      this.updatedUrl = this.lastElem[0] + '_' + this.lang + '.' + this.lastElem[1];
      this.splitUrl[this.splitUrl.length] = this.updatedUrl;
      return this.splitUrl.join('/');
  }

  navigateToExternalUrl() {
    this.urlName = this.link;
    window.open(this.urlName, this.targetValue);
    this.displayDialog = false;
  }

  close() {
    this.displayDialog = false;
  }

  getHyperLinkClass() {
    if (this.position === 'right') {
      this.classValue = this.dir === 'rtl' ? 'hyperLinkClass-rtl' : 'hyperLinkClass';
    }else{
      this.classValue = 'margin-top-1';
    }
    return this.classValue;
  }

  ngAfterViewInit(): void {
    this.controlDataEmitter.emit({
      control: this.control,
      data: this.compData,
    });
  }

}
