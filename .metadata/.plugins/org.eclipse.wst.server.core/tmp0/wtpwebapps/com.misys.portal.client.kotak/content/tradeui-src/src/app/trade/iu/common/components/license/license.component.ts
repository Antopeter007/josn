import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { ConfirmationService, DialogService } from 'primeng';
import { LicenseDialogComponent } from '../../../../../common/components/license-dialog/license-dialog.component';
import { Constants } from '../../../../../common/constants';
import { LicenseData } from '../../../../../common/model/licenseData';
import { CommonService } from '../../../../../common/services/common.service';
import { LicenseService } from '../../../../../common/services/license.service';
import { ValidationService } from '../../../../../common/validators/validation.service';
import { IUCommonDataService } from '../../service/iuCommonData.service';
import { CommonDataService } from '../../../../../common/services/common-data.service';

@Component({
  selector: 'fcc-iu-common-license',
  templateUrl: './license.component.html',
  styleUrls: ['./license.component.scss'],
  providers: [DialogService]

})
export class IUCommonLicenseComponent implements OnInit {
  License: UntypedFormGroup;
  @Input() public bgRecord;
  @Output() formReady = new EventEmitter<UntypedFormGroup>();
  lsAllocatedAmt = '';
  viewMode = false;
  imagePath: string;
  licenses: LicenseData[] = [];
  mode: string;
  unsignedMode = false;
  isBankUser: boolean;
  licenseCurrCode: string;

  constructor(protected fb: UntypedFormBuilder,
              public confirmationService: ConfirmationService,
              public validationService: ValidationService,
              public uploadFile: LicenseService,
              protected translate: TranslateService,
              public commonService: CommonService,
              public dialogService: DialogService,
              public commonDataService: IUCommonDataService,
              public readonly commonData: CommonDataService) { }

  ngOnInit() {
    this.isBankUser = this.commonData.getIsBankUser();
    this.License = this.fb.group({
      listOfLicenses: [''],
      lsAllocatedAmt: [''],
      bgCurCode: ''
    });
    this.licenseCurrCode = this.bgRecord.bgCurCode;
    if (this.commonDataService.getDisplayMode() === 'view' || this.commonDataService.getDisplayMode() === Constants.VIEW_AMEND) {
      this.viewMode = true;
    } else if (this.commonDataService.getDisplayMode() === Constants.UNSIGNED_AMEND) {
      this.unsignedMode = true;
    }
    if (this.commonDataService.getMode() === Constants.MODE_AMEND
      || this.commonDataService.getMode() === Constants.MODE_DRAFT
      || this.commonDataService.getMode() === Constants.MODE_UNSIGNED
      || (this.commonDataService.getTnxType() === '01' &&
      (this.commonDataService.getOption() === Constants.OPTION_EXISTING) ||
      this.commonDataService.getOption() === Constants.OPTION_REJECTED)
      || this.isBankUser) {
      this.commonDataService.setCurCode(this.bgRecord.bgCurCode, '');
      this.commonDataService.setBeneficiary(this.bgRecord.beneficiaryName);
      this.commonDataService.setExpDate(this.bgRecord.bgExpDate);
    }

    if (this.commonDataService.getMode() === Constants.MODE_AMEND
      || this.commonDataService.getMode() === Constants.MODE_DRAFT
      || this.commonDataService.getMode() === Constants.MODE_UNSIGNED
      || this.isBankUser) {
      this.mode = Constants.INITIATE_AMEND;
      if (this.bgRecord[`linkedLicenses`] && this.bgRecord[`linkedLicenses`] !== '') {
        for (let i = 0; i < this.bgRecord[`linkedLicenses`][`license`].length; i++) {
          this.License.addControl(`lsAllocatedAmt${i}`, new UntypedFormControl('', [Validators.required]));
          this.uploadFile.pushFiles(
            this.bgRecord[`linkedLicenses`][`license`][i][`lsRefId`],
            this.bgRecord[`linkedLicenses`][`license`][i][`boRefId`],
            this.bgRecord[`linkedLicenses`][`license`][i][`lsNumber`],
            this.commonService.transformAmt(this.bgRecord[`linkedLicenses`][`license`][i][`lsAllocatedAmt`], this.bgRecord.bgCurCode),
            this.commonService.transformAmt(this.bgRecord[`linkedLicenses`][`license`][i][`lsAmt`], this.bgRecord.bgCurCode),
            this.commonService.transformAmt(this.bgRecord[`linkedLicenses`][`license`][i][`lsOsAmt`], this.bgRecord.bgCurCode),
            this.commonService.transformAmt(this.bgRecord[`linkedLicenses`][`license`][i][`convertedOsAmt`], this.bgRecord.bgCurCode),
            this.bgRecord[`linkedLicenses`][`license`][i][`allowOverdraw`],
            this.bgRecord[`linkedLicenses`][`license`][i][`allowMultipleLicense`]);
          if (this.commonData.isDecisionReject) {
            this.License.controls[`lsAllocatedAmt${i}`].clearValidators();
          } else {
            this.License.controls[`lsAllocatedAmt${i}`].setValidators([Validators.required]);
          }
          this.License.controls[`lsAllocatedAmt${i}`].setValue(this.commonService.transformAmt(
            this.bgRecord[`linkedLicenses`][`license`][i][`lsAllocatedAmt`], this.licenseCurrCode));
          this.License.controls[`lsAllocatedAmt${i}`].updateValueAndValidity();
          this.License.get('listOfLicenses').setValue(this.uploadFile.licenseMap);
        }
      }
    }
    this.License.patchValue({
      bgCurCode: this.bgRecord.bgCurCode
    });
    this.formReady.emit(this.License);
    this.imagePath = this.commonService.getImagePath();
  }

  get licenselist() {
    return this.uploadFile.getlist();
  }

  showLicenseSection(): void {
    if ((this.commonData.getEntity() && this.commonDataService.getExpDate() &&
      this.commonDataService.getBeneficiary() && this.commonDataService.getCurCode('') &&
      (this.commonData.getProductCode() === Constants.PRODUCT_CODE_IU)) ||
      (this.commonData.getEntity() && this.commonDataService.getExpDate() &&
      this.commonDataService.getCurCode('') && (this.commonData.getProductCode() === Constants.PRODUCT_CODE_RU))) {
      let title = '';
      this.translate.get('TABLE_LICENSE_LIST').subscribe((value: string) => {
        title = value;
      });
      const ref = this.dialogService.open(LicenseDialogComponent, {
        header: title,
        width: '80vw',
        height: '40vh',
        contentStyle: { overflow: 'auto' }
      });
      ref.onClose.subscribe((licenses) => {
        if (licenses) {
          let countMultiLs = 0;
          for (const selected of licenses) {
            if (selected.allowMultipleLicense === 'N') {
              countMultiLs = countMultiLs + 1;
            }
          }
          const existingStoreSize = this.uploadFile.NumerOfFiles;
          if (existingStoreSize > 0) {
            for (const store of this.uploadFile.licenseMap) {
              if (store.allowMultipleLicense === 'N') {
                countMultiLs = countMultiLs + 1;
              }
            }
          }
          if ((existingStoreSize + licenses.length) > 1 && countMultiLs > 0) {
            let message = '';
            let dialogHeader = '';
            this.translate.get('ERROR_TITLE').subscribe((value: string) => {
              dialogHeader = value;
            });
            this.translate.get('ERROR_ALLOW_MULTIPLE_LICENSE').subscribe((value: string) => {
              message = value;
            });

            this.confirmationService.confirm({
              message,
              header: dialogHeader,
              icon: Constants.TRIANGLE_ICON,
              key: 'licenseErrorDialog',
              rejectVisible: false,
              acceptLabel: this.commonService.getTranslation('USER_ACTION_OK'),
              accept: () => {
              }
            });
          } else {
            if (existingStoreSize === 0) {
              for (const selected of licenses) {
                this.uploadFile.pushFiles(selected.lsRefId, selected.boRefId, selected.lsNumber, this.lsAllocatedAmt, selected.lsAmt,
                  selected.lsOutstandingAmt, selected.convertedOutstandingAmt, selected.allowOverdraw,
                  selected.allowMultipleLicense);
              }
            } else {
              for (const selected of licenses) {
                let isValid = true;
                for (const store of this.uploadFile.licenseMap) {
                  if (selected.lsRefId === store.lsRefId) {
                    isValid = false;
                    break;
                  }
                }
                if (isValid === true) {
                  this.uploadFile.pushFiles(selected.lsRefId, selected.boRefId, selected.lsNumber, this.lsAllocatedAmt, selected.lsAmt,
                    selected.lsOutstandingAmt, selected.convertedOutstandingAmt, selected.allowOverdraw, selected.allowMultipleLicense);
                }
              }
            }
            if (this.commonDataService.getMode() === Constants.MODE_AMEND || this.commonDataService.getMode() === Constants.MODE_DRAFT) {
              for (let i = existingStoreSize; i < this.uploadFile.NumerOfFiles; i++) {
                this.License.addControl(`lsAllocatedAmt${i}`, new UntypedFormControl('', [Validators.required]));
                if (this.commonData.isDecisionReject) {
                  this.License.controls[`lsAllocatedAmt${i}`].clearValidators();
                } else {
                  this.License.controls[`lsAllocatedAmt${i}`].setValidators([Validators.required]);
                }
                this.License.controls[`lsAllocatedAmt${i}`].setValue('');
                this.License.controls[`lsAllocatedAmt${i}`].updateValueAndValidity();
              }
            } else {
              for (let i = 0; i < this.uploadFile.NumerOfFiles; i++) {
                this.License.addControl(`lsAllocatedAmt${i}`, new UntypedFormControl('', [Validators.required]));
                if (this.commonData.isDecisionReject) {
                  this.License.controls[`lsAllocatedAmt${i}`].clearValidators();
                } else {
                  this.License.controls[`lsAllocatedAmt${i}`].setValidators([Validators.required]);
                }
                this.License.controls[`lsAllocatedAmt${i}`].updateValueAndValidity();
              }
            }
          }
        }
      });
      this.License.get('listOfLicenses').setValue(this.uploadFile.licenseMap);
    } else {
      let message = '';
      let dialogHeader = '';
      if (this.commonData.getProductCode() === Constants.PRODUCT_CODE_IU) {
      this.translate.get('SELECT_REQUIRED_VALUES_LICENSE').subscribe((value: string) => {
        message = value;
      });
    } else if (this.commonData.getProductCode() === Constants.PRODUCT_CODE_RU) {
      this.translate.get('SELECT_REQUIRED_VALUES_LICENSE_RU').subscribe((value: string) => {
        message = value;
      });
    }

      this.translate.get('DAILOG_ERROR').subscribe((res: string) => {
        dialogHeader = res;
      });


      this.confirmationService.confirm({
        message,
        header: dialogHeader,
        icon: Constants.TRIANGLE_ICON,
        key: 'licenseErrorDialog',
        rejectVisible: false,
        acceptLabel: 'Ok',
        accept: () => {
        }
      });
    }
  }

  deleteRow(name: string): void {
    let message = '';
    let dialogHeader = '';
    this.translate.get('DELETE_CONFIRMATION_MSG').subscribe((value: string) => {
      message = value;
    });

    this.translate.get('DAILOG_CONFIRMATION').subscribe((res: string) => {
      dialogHeader = res;
    });

    this.confirmationService.confirm({
      message,
      header: dialogHeader,
      icon: Constants.TRIANGLE_ICON,
      key: 'licenseConfirmDialog',
      acceptLabel: this.commonService.getTranslation('USER_ACTION_OK'),
      rejectLabel: 'Cancel',
      accept: () => {
        for (let i = 0; i < this.uploadFile.licenseMap.length; ++i) {
          if (this.uploadFile.licenseMap[i].lsRefId === name) {
            this.uploadFile.licenseMap.splice(i, 1);
          }
        }
      },
      reject: () => {
      }
    });
  }

  setAllocatedAmtValue(refid: string) {
    if (this.commonDataService.getCurCode('') !== null && this.commonDataService.getCurCode('') !== '') {
      this.License.get('bgCurCode').setValue(this.commonDataService.getCurCode(''));
    } else if (this.bgRecord.bgCurCode !== null && this.bgRecord.bgCurCode !== '') {
      this.License.get('bgCurCode').setValue(this.bgRecord.bgCurCode);
    }
    for (let i = 0; i < this.uploadFile.licenseMap.length; ++i) {
      if (this.uploadFile.licenseMap[i].lsRefId === refid) {
        this.uploadFile.licenseMap[i].lsAllocatedAmt = this.License.controls[`lsAllocatedAmt${i}`].value;
        if (this.commonData.isDecisionReject) {
          this.License.controls[`lsAllocatedAmt${i}`].clearValidators();
        } else {
          this.License.controls[`lsAllocatedAmt${i}`].setValidators([Validators.required]);
        }
        this.License.controls[`lsAllocatedAmt${i}`].updateValueAndValidity();
      }
      if (this.uploadFile.licenseMap[i].lsRefId === refid &&
          (parseFloat(this.commonService.getNumberWithoutLanguageFormatting(this.uploadFile.licenseMap[i].lsAllocatedAmt)) >
           parseFloat(this.commonService.getNumberWithoutLanguageFormatting(this.uploadFile.licenseMap[i].convertedOsAmt))) &&
          this.uploadFile.licenseMap[i].allowOverdraw === 'N') {
          let message = '';
          let dialogHeader = '';
          this.translate.get('ERROR_TITLE').subscribe((value: string) => {
            dialogHeader = value;
          });
          this.translate.get('ERROR_LICENSE_OVERDRAW').subscribe((value: string) => {
            message = value;
          });

          this.uploadFile.licenseMap[i].lsAllocatedAmt = '';
          this.License.get(`lsAllocatedAmt${i}`).setValue(null);
          this.confirmationService.confirm({
            message,
            header: dialogHeader,
            icon: Constants.TRIANGLE_ICON,
            key: 'licenseErrorDialog',
            rejectVisible: false,
            acceptLabel: this.commonService.getTranslation('USER_ACTION_OK'),
            accept: () => {
            }
          });
      }
    }
  }

  generatePdf(generatePdfService) {
    // License table
    let headers: string[] = [];
    let columns: any[] = [];
    if (this.bgRecord.linkedLicenses && this.bgRecord.linkedLicenses !== '') {
      generatePdfService.setSectionHeader('HEADER_LICENSES', true);
      headers = [];
      headers.push(this.commonService.getTranslation('REFERENCEID'));
      headers.push(this.commonService.getTranslation('BACK_OFFICE_REFERENCE'));
      headers.push(this.commonService.getTranslation('LICENSE_NUMBER'));
      headers.push(this.commonService.getTranslation('LS_ALLOCATED_AMT'));
      columns = [];
      for (const license of this.bgRecord.linkedLicenses.license) {
        const column: string[] = [];
        column.push(license.lsRefId);
        column.push(license.boRefId);
        column.push(license.lsNumber);
        column.push(this.commonService.transformAmt(license.lsAllocatedAmt, this.licenseCurrCode));
        columns.push(column);
      }
      generatePdfService.createTable(headers, columns);
    }
  }

}

