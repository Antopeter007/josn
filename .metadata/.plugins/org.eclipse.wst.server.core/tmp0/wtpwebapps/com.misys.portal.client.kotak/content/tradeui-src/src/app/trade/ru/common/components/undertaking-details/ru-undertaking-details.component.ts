import { StaticDataService } from './../../../../../common/services/staticData.service';
import { TradeCommonDataService } from './../../../../common/services/trade-common-data.service';
import { Component, OnInit, AfterContentInit, Input } from '@angular/core';
import { CommonService } from '../../../../../common/services/common.service';
import { UntypedFormGroup} from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { DialogService } from 'primeng';
import { IUCommonDataService } from '../../../../iu/common/service/iuCommonData.service';
import { GeneratePdfService } from '../../../../../common/services/generate-pdf.service';
import { CodeData } from '../../../../common/model/codeData.model';
import { ValidationService } from '../../../../../common/validators/validation.service';



@Component({
  selector: 'fcc-ru-undertaking-details',
  templateUrl: './ru-undertaking-details.component.html',
  styleUrls: ['./ru-undertaking-details.component.scss']
})
export class RUUndertakingDetailsComponent implements OnInit {

  @Input() undertakingType;
  @Input('fileContent') public bgRecord;
  @Input('sectionForm') public sectionForm: UntypedFormGroup;
  viewMode: boolean;

  constructor(public validationService: ValidationService,  public commonService: CommonService,
              public staticDataService: StaticDataService, private generatePdfService: GeneratePdfService,
              public tradeCommonDataService: TradeCommonDataService, public dialogService: DialogService,
              public commonDataService: IUCommonDataService ) { }

  public rulesApplicableObj: any[];
  public undertakingTextObj: any[];
  typeOfUndertakingObj: any[] = [];
  typeOfUndertaking: CodeData[];

   ngOnInit() {
    if (!(this.bgRecord[`rule`] && this.bgRecord[`rule`] !== null
       && this.bgRecord[`rule`] !== '') && (this.sectionForm && this.sectionForm != null)) {
       this.sectionForm.get(`rule`).setValue(null);
      }
    this.rulesApplicableObj = [
      { label: this.commonService.getTranslation('RULES_APPLICABLE_URDG'), value: '06' },
      { label: this.commonService.getTranslation('RULES_APPLICABLE_ISPR'), value: '07' },
      { label: this.commonService.getTranslation('RULES_APPLICABLE_OTHR'), value: '08' },
      { label: this.commonService.getTranslation('RULES_APPLICABLE_NONE'), value: '09' },
      { label: this.commonService.getTranslation('RULES_APPLICABLE_UCPR'), value: '10' }
     ];

     // tslint:disable-next-line: align
     this.undertakingTextObj = [
      {label: this.commonService.getTranslation('BANK_STANDARD'), value: '01'},
      {label: this.commonService.getTranslation('BENEFICIARY_WORDING'), value: '02'},
      {label: this.commonService.getTranslation('OUR_WORDING'), value: '03'},
      {label: this.commonService.getTranslation('SAME_AS_SPECIFY'), value: '04'}
     ];

     // tslint:disable-next-line: align
     if (this.tradeCommonDataService.getDisplayMode() === 'view') {
        this.viewMode = true;
      } else {
        this.viewMode = false;
      }

      // tslint:disable-next-line: align
      this.staticDataService.getCodeData('C011').subscribe(data => {
        //console.log('Undertaking Type: ', data);
        this.typeOfUndertaking = data.codeData;
        this.typeOfUndertaking.forEach(data => {
          const undertakingElement: any = {};
          undertakingElement.label = data.longDesc;
          undertakingElement.value = data.codeVal;
          this.typeOfUndertakingObj.push(undertakingElement);

          if (this.bgRecord.type_code === undertakingElement.value) {
            this.sectionForm.get('type_code').setValue(undertakingElement.value);
          }
        });
     });
   }
   generatePdf(generatePdfService) {
    generatePdfService.setSectionDetails('UNDERTAKING_DETAILS_LABEL', true, false, 'undertakingDetails');
  }

}
