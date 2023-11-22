import { CommonDataService } from '../../services/common-data.service';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { CommonService } from '../../services/common.service';
import { UntypedFormGroup, UntypedFormBuilder, UntypedFormControl, Validators } from '@angular/forms';
import { StaticDataService } from '../../services/staticData.service';
import { Constants } from '../../constants';
import { validateSwiftCharSet } from '../../validators/common-validator';
import { ValidationService } from '../../validators/validation.service';

class DropdownOptions {
  label: string;
  value: string;
}

type CodeData = {
  codeVal: string;
  longDesc: string;
  shortDesc: string;
}

@Component({
  selector: 'fcc-common-courier-details',
  templateUrl: './courier-details.component.html',
  styleUrls: ['./courier-details.component.scss']
})

export class CourierDetailsComponent implements OnInit {
  @Input() viewMode = true;
  public unsignedMode = false;
  actionReqObj: DropdownOptions [];
  courierPartnerOptns : CodeData[];
  public courierPartnerOptnsObj: any[] = [];
  @Input() public courierDetailsForm: UntypedFormGroup;

  @Input() public bgRecord;
  @Output() formReady = new EventEmitter<UntypedFormGroup>();

  constructor(
    public translate: TranslateService,
    public commonData: CommonDataService,
    protected commonService: CommonService,
    public validationService: ValidationService,
    protected fb: UntypedFormBuilder,
    protected staticDataService: StaticDataService) { }
    
    ngOnInit()
    {
      this.initFieldValues();
      this.updateCourierPartnerValues();
      this.viewMode = (this.commonData.getDisplayMode() === Constants.MODE_VIEW);

      if(this.bgRecord && this.bgRecord.courierPartner)
      {
        this.courierDetailsForm.get('courierPartner').setValue(this.bgRecord.courierPartner);
      }
      if(this.bgRecord && this.bgRecord.courierPartnerWaybillNo)
      {
        this.courierDetailsForm.get('courierPartnerWaybillNo').setValue(this.bgRecord.courierPartnerWaybillNo);
      }
      this.courierDetailsForm.updateValueAndValidity();

      // Emit the form group to the parent
      this.formReady.emit(this.courierDetailsForm);
    }
    
    generatePdf(generatePdfService)
    {
      if (generatePdfService && this.bgRecord && (this.bgRecord.courierPartner || this.bgRecord.courierPartnerWaybillNo))
      {
        generatePdfService.setSectionHeader('HEADER_COURIER_DETAILS', true);
        if(this.bgRecord && this.bgRecord.courierPartner)
        {
          generatePdfService.setSectionLabel('COURIER_PARTNER', true);
          generatePdfService.setSectionContent(`${this.bgRecord?.courierPartner}`, false);
        }
        if(this.bgRecord && this.bgRecord.courierPartnerWaybillNo)
        {
          generatePdfService.setSectionLabel('COURIER_PARTNER_WAYBILL_NO', true);
          generatePdfService.setSectionContent(`${this.bgRecord?.courierPartnerWaybillNo}`, false);
        }
    }
  }

  updateCourierPartnerValues()
  {
    this.courierPartnerOptnsObj = [];
    this.staticDataService.getCodeData('C103').subscribe(cData => {
      this.courierPartnerOptns = cData.codeData;
      this.courierPartnerOptns.forEach(codeDataRow => {
        const courierPartnerElement: any = {};
        courierPartnerElement.label = codeDataRow.longDesc;
        courierPartnerElement.value = codeDataRow.codeVal;
        this.courierPartnerOptnsObj.push(courierPartnerElement);
        if (this.courierDetailsForm.get('courierPartner')?.value === codeDataRow.codeVal 
        || this.bgRecord?.courierPartner === codeDataRow.codeVal) {
          this.courierDetailsForm.get('courierPartner').setValue(codeDataRow.codeVal);
        }
      });
    });
  }

  initFieldValues()
  {
    this.courierDetailsForm = this.fb.group({
      courierPartnerWaybillNo: ['', [Validators.maxLength(Constants.LENGTH_100), validateSwiftCharSet(Constants.X_CHAR)]]
    });
    this.courierDetailsForm.addControl('courierPartner', new UntypedFormControl(''));
    this.courierDetailsForm.addControl('courierPartnerWaybillNo', new UntypedFormControl(''));

    this.courierDetailsForm.patchValue({
      courierPartner: this.bgRecord?.courierPartner,
      courierPartnerWaybillNo: this.bgRecord?.courierPartnerWaybillNo
    });
    this.courierDetailsForm.updateValueAndValidity();
  }

}
