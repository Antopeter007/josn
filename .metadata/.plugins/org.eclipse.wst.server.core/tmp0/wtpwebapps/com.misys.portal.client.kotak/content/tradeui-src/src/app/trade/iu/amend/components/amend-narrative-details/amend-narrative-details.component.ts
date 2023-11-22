import { CommonDataService } from './../../../../../common/services/common-data.service';
import { TranslateService } from '@ngx-translate/core';
import { ConfirmationService, DialogService } from 'primeng';
import { PhraseDialogComponent } from './../../../../../common/components/phrase-dialog/phrase-dialog.component';
import { Constants } from '../../../../../common/constants';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { ValidationService } from '../../../../../common/validators/validation.service';
import { validateSwiftCharSet } from '../../../../../common/validators/common-validator';
import { IUCommonDataService } from '../../../common/service/iuCommonData.service';
import { CommonService } from '../../../../../common/services/common.service';


@Component({
  selector: 'fcc-iu-amend-narrative-details',
  templateUrl: './amend-narrative-details.component.html',
  styleUrls: ['./amend-narrative-details.component.scss']
})
export class AmendNarrativeDetailsComponent implements OnInit {

  @Input() public bgRecord;
  amendNarrativeSection: UntypedFormGroup;
  viewMode = false;
  unsignedMode = false;
  swiftMode = false;
  modalDialogTitle: string;
  @Output() formReady = new EventEmitter<UntypedFormGroup>();



  constructor(
    protected fb: UntypedFormBuilder, public translate: TranslateService,
    public validationService: ValidationService, public dialogService: DialogService,
    protected commonDataService: IUCommonDataService, public commonService: CommonService,
    public confirmationService: ConfirmationService, public commonData: CommonDataService
    ) { }

  ngOnInit() {
    this.translate.get('TABLE_PHRASES_LIST').subscribe((res: string) => {
      this.modalDialogTitle =  res;
    });
    if (this.commonDataService.getDisplayMode() === Constants.UNSIGNED_AMEND) {
      this.unsignedMode = true;
    }
    this.amendNarrativeSection = this.fb.group({
      bgAmdDetails: ['']
    });
    if (this.bgRecord.advSendMode && this.bgRecord.advSendMode !== null && this.bgRecord.advSendMode !== '') {
      this.setValidatorsIfModeSwift(this.bgRecord.advSendMode === '01');
     }
    // Emit the form group to the parent
    this.formReady.emit(this.amendNarrativeSection);

    if (this.commonDataService.getMode() === Constants.MODE_DRAFT) {
      this.initFieldValues();
    }
  }
  initFieldValues() {
    this.amendNarrativeSection.patchValue({
      entity: this.bgRecord.entity,
      bgAmdDetails: this.bgRecord.bgAmdDetails
    });
  }
  setValidatorsIfModeSwift(swiftModeSelected) {
    this.swiftMode = swiftModeSelected;
    if (!swiftModeSelected) {
      this.amendNarrativeSection.get(`bgAmdDetails`).clearValidators();
      this.amendNarrativeSection.get(`bgAmdDetails`).updateValueAndValidity();
    } else {
      this.amendNarrativeSection.get(`bgAmdDetails`).clearValidators();
      this.amendNarrativeSection.get(`bgAmdDetails`).setValidators(
        [Validators.maxLength(Constants.LENGTH_9750), validateSwiftCharSet(Constants.Z_CHAR)]);
      this.amendNarrativeSection.get(`bgAmdDetails`).updateValueAndValidity();
    }
  }

  openPhraseDialog(formControlName: string) {
    const applicantEntityName = this.bgRecord.entity != null ? this.bgRecord.entity : this.bgRecord.applicantName;
    const ref = this.dialogService.open(PhraseDialogComponent, {
      data: {
        product: Constants.PRODUCT_CODE_IU,
        categoryName: formControlName,
        applicantEntityName
      },
      header: this.modalDialogTitle,
      width: '65vw',
      height: '80vh',
      contentStyle: { overflow: 'auto', height: '80vh' }
    });
    ref.onClose.subscribe((text: string) => {
      if (text) {
        if (text.includes('\\n')) {
          text = text.split('\\n').join('');
        }
        let finalText = '';
        if (this.amendNarrativeSection.get(formControlName).value != null &&
            this.amendNarrativeSection.get(formControlName).value !== '') {
            finalText = this.amendNarrativeSection.get(formControlName).value.concat('\n');
        } else {
          finalText = this.amendNarrativeSection.get(formControlName).value;
        }
        finalText = finalText.concat(text);
        this.amendNarrativeSection.get(formControlName).setValue(finalText);
      }
    });
  }
}
