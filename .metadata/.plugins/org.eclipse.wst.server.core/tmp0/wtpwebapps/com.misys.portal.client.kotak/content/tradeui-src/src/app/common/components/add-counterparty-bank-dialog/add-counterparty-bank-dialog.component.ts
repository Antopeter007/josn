import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core';
import { UntypedFormGroup, Validators, UntypedFormBuilder, UntypedFormControl } from '@angular/forms';
import { ConfirmationService } from 'primeng/api';
import { ValidationService } from '../../validators/validation.service';
import { TranslateService } from '@ngx-translate/core';
import { validateSwiftCharSet } from '../../validators/common-validator';
import { Constants } from '../../constants';
import { CommonService } from '../../services/common.service';
import { EntityDialogComponent } from '../entity-dialog/entity-dialog.component';
import { CountryDialogComponent } from '../country-dialog/country-dialog.component';
import { StaticDataService } from '../../services/staticData.service';
import { Entity } from '../../model/entity.model';
import { CommonDataService } from '../../services/common-data.service';
import { URLConstants } from '../../urlConstants';
import { CountryValidationService } from '../../services/countryValidation.service';
import { DialogService, DynamicDialogRef, DynamicDialogConfig } from 'primeng';

@Component({
  selector: 'fcc-common-add-counterparty-bank-dialog',
  templateUrl: './add-counterparty-bank-dialog.component.html',
  styleUrls: ['./add-counterparty-bank-dialog.component.scss'],
  providers: [DialogService]
})
export class AddCounterpartyBankDialogComponent implements OnInit {

  headerEntityListDialog: string;
  headerCountriesListDialog: string;
  imagePath: string;
  displayCountryDialog = false;
  modalCountryTitle: string;
  displayEntityDialog = false;
  modalEntityTitle: string;
  noOfEntities: number;
  responseMessage: string;
  modalDialogTitle: string;

  @Input() addCPBDetails: UntypedFormGroup;
  @Input() showHelp = true;
  typeOfDialog: string;
  confirmationBoxKey: string;
  @Output() displayAddCounterPartyBankChange = new EventEmitter();

  constructor(protected confirmationService: ConfirmationService,
              public validationService: ValidationService,
              protected staticDataService: StaticDataService, protected fb: UntypedFormBuilder,
              protected translate: TranslateService, public dialogService: DialogService,
              public commonService: CommonService, public config: DynamicDialogConfig,
              public ref: DynamicDialogRef, public commonDataService: CommonDataService,
              public countryValidationService: CountryValidationService) { }

  ngOnInit() {
    this.noOfEntities = 0;
    this.onLoad();
    this.confirmationBoxKey = this.config.data.id;
    this.typeOfDialog = this.config.data.id;
  }

  onLoad() {
    this.noOfEntities = this.commonService.getNumberOfEntities();
    this.addCPBDetails = this.fb.group({
      entity: '',
      abbv_name: ['', [Validators.maxLength(Constants.LENGTH_35), Validators.required, validateSwiftCharSet(Constants.X_CHAR)]],
      name: ['', [Validators.maxLength(Constants.LENGTH_35), Validators.required, validateSwiftCharSet(Constants.X_CHAR)]],
      street_name: ['', [Validators.maxLength(Constants.LENGTH_35), validateSwiftCharSet(Constants.X_CHAR)]],
      town_name: ['', [Validators.maxLength(Constants.LENGTH_35), validateSwiftCharSet(Constants.X_CHAR)]],
      country_sub_div: ['', [Validators.maxLength(Constants.LENGTH_35), validateSwiftCharSet(Constants.X_CHAR)]],
      post_code: ['', [Validators.maxLength(Constants.LENGTH_16), validateSwiftCharSet(Constants.X_CHAR)]],
      swift_address_line_1: [''],
      address_line_1: ['', [Validators.maxLength(Constants.LENGTH_35), Validators.required, validateSwiftCharSet(Constants.X_CHAR)]],
      address_line_2: ['', [Validators.maxLength(Constants.LENGTH_35), validateSwiftCharSet(Constants.X_CHAR)]],
      dom: ['', [Validators.maxLength(Constants.LENGTH_35), validateSwiftCharSet(Constants.X_CHAR)]],
      country: ['', [Validators.required, Validators.pattern(Constants.REGEX_CURRENCY)]],
      contact_name: ['', [Validators.maxLength(Constants.LENGTH_35), validateSwiftCharSet(Constants.X_CHAR)]],
      phone: ['', [Validators.maxLength(Constants.LENGTH_32), Validators.pattern(Constants.PHONE_NUMBER)]],
      fax: ['', [Validators.maxLength(Constants.LENGTH_32), Validators.pattern(Constants.PHONE_NUMBER)]],
      telex: ['', [Validators.maxLength(Constants.LENGTH_32), Validators.pattern(Constants.PHONE_NUMBER)]],
      bei: ['', [Validators.maxLength(Constants.LENGTH_11), validateSwiftCharSet(Constants.X_CHAR),
        Validators.pattern(Constants.REGEX_BIC_CODE)]],
      iso_code: ['', [Validators.maxLength(Constants.LENGTH_11), validateSwiftCharSet(Constants.X_CHAR),
        Validators.pattern(Constants.REGEX_BIC_CODE)]],
      email: ['', [Validators.required, Validators.pattern(Constants.EMAIL)]],
      web_address: ['', [Validators.maxLength(Constants.LENGTH_40), Validators.pattern(Constants.WEB_ADDRESS)]]
    });
    if (this.noOfEntities > 0) {
      this.setValidatorEntity();
    }
    this.imagePath = this.commonService.getImagePath();
  }

  setValidatorEntity() {
    this.addCPBDetails.controls.entity.setValidators([Validators.required, Validators.maxLength(Constants.LENGTH_64),
      validateSwiftCharSet(Constants.X_CHAR)]);
  }
  onSave() {
    if (this.noOfEntities === 0) {
      this.addCPBDetails.patchValue({
        entity: '*'
      });
    }
    if (this.addCPBDetails.valid) {
      if (this.config.data.id === 'bank') {
        this.staticDataService.saveOrSubmitBank(this.addCPBDetails.getRawValue()).subscribe(data => {
            this.responseMessage = data.response;
            this.ref.close(this.responseMessage);
          }
        );
      } else if (this.config.data.id === 'beneficiary' || this.config.data.id === 'cuBeneficiary') {
        this.staticDataService.saveOrSubmitCounterParty(this.addCPBDetails.getRawValue()).subscribe(data => {
            this.responseMessage = data.response;
            this.ref.close(this.responseMessage);
          }
        );
      }
    } else {
      this.validateAllFields(this.addCPBDetails);
    }
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

  openAddCounterParyBankConfirmDialog(operation: string) {
    let message = '';
    if (operation === 'save') {
      this.translate.get('CONFIRMATION_SAVE').subscribe((value: string) => {
        message =  value;
       });
    } else {
      this.translate.get('CONFIRMATION_CANCEL').subscribe((value: string) => {
        message =  value;
       });
    }
    this.confirmationService.confirm({
      message,
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      key: this.confirmationBoxKey,
      accept: () => {
        if (operation === 'save') {
          this.onSave();
        } else if (operation === 'cancel') {
          this.ref.close();
        }
      },
      reject: () => {
      }
    });
  }

  openCountryDialog() {
    const ref = this.dialogService.open(CountryDialogComponent, {
        header: this.modalDialogTitle,
        width: '30vw',
        height: '65vh',
        contentStyle: {overflow: 'auto', height: '65vh'}
      });
    ref.onClose.subscribe((event) => {
      if (event) {
        this.addCPBDetails.get('country').setValue(event);
      }
    });
  }

  onAddCounterPartyOrBankDialogClose() {
    this.addCPBDetails.reset();
    this.displayAddCounterPartyBankChange.emit({display: false});
  }

  openEntityDialog() {
    const ref = this.dialogService.open(EntityDialogComponent, {
      header: this.commonService.getTranslation('TABLE_SUMMARY_ENTITIES_LIST'),
      width: '65vw',
      height: '65vh',
      contentStyle: {overflow: 'auto', height: '65vh'}
    });
    ref.onClose.subscribe((entity: Entity) => {
      if (entity) {
        this.addCPBDetails.get('entity').setValue(entity.ABBVNAME);
      }
    });
  }

  resetForm() {
    this.addCPBDetails.reset();
  }

  openHelp() {
    const host = window.location.origin;
    let url = host + this.commonService.getBaseServletUrl();
    const userLanguage = this.commonService.getUserLanguage();
    let productCode = this.commonDataService.getProductCode();
    if (productCode === Constants.PRODUCT_CODE_IU) {
      productCode = 'IU';
    } else if (productCode === Constants.PRODUCT_CODE_RU) {
      productCode = 'RU';
    }
    const helpCode = '_01';
    const accessKey = productCode + helpCode;
    url += URLConstants.ONLINE_HELP;
    url += `/?helplanguage=${userLanguage}`;
    url += `&accesskey=${accessKey}`;
    const myWindow = window.open(url, Constants.TRANSACTION_POPUP, 'width=800,height=500,resizable=yes,scrollbars=yes');
    myWindow.focus();
  }

}
