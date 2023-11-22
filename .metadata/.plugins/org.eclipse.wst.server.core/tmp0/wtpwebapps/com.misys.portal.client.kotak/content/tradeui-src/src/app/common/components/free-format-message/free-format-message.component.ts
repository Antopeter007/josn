import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Constants } from '../../../common/constants';
import { TranslateService } from '@ngx-translate/core';
import { validateSwiftCharSet } from '../../../common/validators/common-validator';
import { ValidationService } from '../../../common/validators/validation.service';
import { IUCommonDataService } from '../../../trade/iu/common/service/iuCommonData.service';
import { CommonDataService } from '../../services/common-data.service';
import { PhraseDialogComponent } from '../../../common/components/phrase-dialog/phrase-dialog.component';
import { DialogService } from 'primeng';


@Component({
  selector: 'fcc-common-free-format-message',
  templateUrl: './free-format-message.component.html',
  styleUrls: ['./free-format-message.component.scss']
})
export class FreeFormatMessageComponent implements OnInit {

  freeFormatMessageSection: UntypedFormGroup;
  viewMode: boolean;
  public option;
  @Output() formReady = new EventEmitter<UntypedFormGroup>();
  @Input() public bgRecord;
  @Input() public labelName;
  modalDialogTitle: string;



  constructor(protected fb: UntypedFormBuilder, public validationService: ValidationService,
              protected commonDataService: IUCommonDataService,
              public dialogService: DialogService,
              public translate: TranslateService,
              protected commonData: CommonDataService)  { }

  ngOnInit() {

   let  maxlength: number;
   let  charSet: string;
   let option: string;
   this.translate.get('TABLE_PHRASES_LIST').subscribe((res: string) => {
    this.modalDialogTitle =  res;
  });

   if (this.commonData.getProductCode() === Constants.PRODUCT_CODE_RU) {
    option = this.commonData.getOption();
   } else if (this.commonDataService.getProductCode() === Constants.PRODUCT_CODE_IU) {
    option = this.commonDataService.getOption();
   }
   if (option === Constants.OPTION_CANCEL || option === Constants.OPTION_EXISTING) {
      maxlength = Constants.LENGTH_1750;
      charSet = Constants.X_CHAR;
    } else {
      maxlength = Constants.LENGTH_210;
      charSet = Constants.Z_CHAR;
    }

   this.freeFormatMessageSection = this.fb.group({
      bgFreeFormatText: ['', [Validators.required, Validators.maxLength(maxlength), validateSwiftCharSet(charSet)]]
    });

   if (this.commonDataService.getMode() === Constants.MODE_DRAFT || this.commonData.getMode() === Constants.MODE_DRAFT) {
    if (this.commonData.getProductCode() === Constants.PRODUCT_CODE_RU) {
      this.freeFormatMessageSection.patchValue({
        bgFreeFormatText: this.bgRecord.freeFormatText
      });
    } else {
      this.freeFormatMessageSection.patchValue({
        bgFreeFormatText: this.bgRecord.bgFreeFormatText
      });
    }
    }

      // Emit the form group to the parent
   this.formReady.emit(this.freeFormatMessageSection);
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
        if (this.freeFormatMessageSection.get(formControlName).value != null &&
            this.freeFormatMessageSection.get(formControlName).value !== '') {
            finalText = this.freeFormatMessageSection.get(formControlName).value.concat('\n');
        } else {
          finalText = this.freeFormatMessageSection.get(formControlName).value;
        }
        finalText = finalText.concat(text);
        this.freeFormatMessageSection.get(formControlName).setValue(finalText);
      }
    });
  }
}
