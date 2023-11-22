import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { DialogService } from 'primeng/dynamicdialog';
import { FccGlobalConstantService } from './../../../../../common/core/fcc-global-constant.service';
import { FccGlobalConstant } from './../../../../../common/core/fcc-global-constants';
import { CommonService } from './../../../../../common/services/common.service';
import { ReauthService } from './../../../../../common/services/reauth.service';
import { ConfirmationDialogComponent } from
'./../../../../../corporate/trade/lc/initiation/component/confirmation-dialog/confirmation-dialog.component';

@Injectable({
  providedIn: 'root'
})
export class AutoForwardService {
  displayAutoForwardPopUp: boolean;

  constructor(protected http: HttpClient, protected fccGlobalConstantService: FccGlobalConstantService,
    protected dialogService: DialogService, protected commonService: CommonService,
    protected translateService: TranslateService, protected reauthService: ReauthService) { }

    getDateName(requestObj, flag): string {
      if (flag) {
        return requestObj.recurringEnabled === 'Y' ? FccGlobalConstant.FT_START_DATE : FccGlobalConstant.TRANSFERDATE;
      }
      return requestObj.transaction.recurring_payment_enabled === 'N' ? FccGlobalConstant.TRANSFERDATE : FccGlobalConstant.STARTDATE;
    }

    getDateValue(requestObj, flag): string {
      if (flag) {
        return requestObj.recurringEnabled === 'Y' ? requestObj.recurringStartDate : requestObj.transferDate;
      } else {
        return requestObj.transaction.recurring_payment_enabled === 'N' ? requestObj.transaction.iss_date :
        requestObj.transaction.recurring_start_date;
      }
    }
  
    getAutoForwardDetails(requestObj, flag) {
    const params = new HttpParams({
      fromObject: {
        bankAbbvName: flag ? requestObj.bank : requestObj.transaction.issuing_bank_abbv_name,
        entity_abbv_name: flag ? requestObj.entity : requestObj.transaction.entity,
        product_code: flag ? requestObj.productCode : requestObj.transaction.product_code,
        sub_product_code: flag ? requestObj.subProductCode : requestObj.transaction.sub_product_code,
        cur_code: flag ? requestObj.currency : requestObj.transaction.ft_cur_code,
        date_names: this.getDateName(requestObj, flag),
        date_values: this.getDateValue(requestObj, flag),
        amount: flag ? requestObj.amount : requestObj.transaction.ft_amt,
      }
    });
    const obj = {};
    obj['Content-Type'] = FccGlobalConstant.APP_JSON;
    obj['Accept'] = FccGlobalConstant.APP_JSON;
    const headers = new HttpHeaders(obj);
    const url = this.fccGlobalConstantService.baseUrl + 'v1/bussiness-date-time-cutoff';
    return this.http.get<any>(url, { headers , params, observe: 'response' });
  }

  handleAutoForward(requestData: any, showReturnButton: boolean) {
    this.getAutoForwardDetails(showReturnButton ? requestData : requestData.request, showReturnButton).subscribe((response) => {
      const resp = response;
      if (!response.body.valid && this.commonService.getOpenDialog() === 0) {
        if (response.body.autoForwardEnabled) {
          this.commonService.setOpenDialog(1);
          const dialogRef = this.dialogService.open(ConfirmationDialogComponent, {
            header: `${this.translateService.instant('Error')}`,
            width: '40em',
            styleClass: 'fileUploadClass',
            style: { direction: localStorage.getItem('langDir') },
            modal: true,
            closeOnEscape: true,
            data: { 
              locaKey: response.body.type === 'CUTOFF' ? `${this.translateService.instant('autoForwardEnabledErrorMessage', 
              { date: resp.body.autoForwardDate ,dateType: this.translateService.instant(resp.body.field) })}` 
              : `${this.translateService.instant('autoForwardEnabledHolidayErrorMessage', 
              { date: resp.body.autoForwardDate , dateType: this.translateService.instant(resp.body.field) })}`,
              showAutoForwardButton: true,
              showReturnButton: showReturnButton,
              showCancelButton: false,
              showYesButton: false,
              showNoButton: false,
              showCloseButton: true
             },
            baseZIndex: 9999,
            autoZIndex: true
          });
          dialogRef.onClose.subscribe((result: any) => {
            this.commonService.isApproveAllowed.next(true);
            if (result === 'autoForward') {
              this.displayAutoForwardPopUp = true;
              dialogRef.destroy();
              this.commonService.setOpenDialog(0);
              if (this.displayAutoForwardPopUp) {
                this.commonService.setOpenDialog(1);
                const autoForwardDialogRef = this.dialogService.open(ConfirmationDialogComponent, {
                  header: `${this.translateService.instant('Confirmation')}`,
                  width: '40em',
                  styleClass: 'fileUploadClass',
                  style: { direction: localStorage.getItem('langDir') },
                  data: { 
                    locaKey: `${this.translateService.instant('autoForwardConfirmationMessage')}`,
                    showOkButton: true,
                    showCancelButton: true,
                    showYesButton: false,
                    showNoButton: false
                   },
                  baseZIndex: 9999,
                  autoZIndex: true
                });
                autoForwardDialogRef.onClose.subscribe((result: any) => {
                  if (result.toLowerCase() === 'yes') {
                    this.commonService.setOpenDialog(0);
                    if (showReturnButton) {
                      if(requestData.recurringEnabled === 'Y') {
                        requestData.recurringStartDate = resp.body.autoForwardDate;
                        requestData.transferDate = resp.body.autoForwardDate;
                      }
                      else {
                        requestData.transferDate = resp.body.autoForwardDate;
                      }
                    } else {
                      if(requestData.request.transaction.recurring_payment_enabled === 'Y') {
                        requestData.request.transaction.recurring_start_date = resp.body.autoForwardDate;
                      } 
                      else {
                        requestData.request.transaction.iss_date = resp.body.autoForwardDate;
                      }
                    }
                  this.reauthService.reauthenticate(requestData, FccGlobalConstant.reAuthComponentKey);
                } else if (result.toLowerCase() === 'cancel') {
                    // set error in the form and preview
                    this.commonService.setOpenDialog(0);
                    if (!showReturnButton) {
                      this.commonService.highlightError.next({
                        field: resp.body.field === FccGlobalConstant.TRANSFERDATE ?
                        FccGlobalConstant.FT_TRANSFER_DATE : FccGlobalConstant.FT_START_DATE,
                        invalid: true,
                        sectionName: resp.body.field === FccGlobalConstant.TRANSFERDATE ? FccGlobalConstant.FT_TPT_GENERAL_DETAILS
                        : 'recurringModel'
                      });
                    }
                  }
                });
              }
            } else if (result.toLowerCase() === 'close') {
              this.commonService.setOpenDialog(0);
              // set error in the form and preview
              if (!showReturnButton) {
                this.commonService.highlightError.next({
                  field: resp.body.field === FccGlobalConstant.TRANSFERDATE ? FccGlobalConstant.FT_TRANSFER_DATE :
                  FccGlobalConstant.FT_START_DATE,
                  invalid: true,
                  sectionName: resp.body.field === FccGlobalConstant.TRANSFERDATE ? FccGlobalConstant.FT_TPT_GENERAL_DETAILS :
                  'recurringModel'
                });
              }
            } else if (result.toLowerCase() === 'return') {
              this.commonService.setOpenDialog(0);
              document.getElementById('comments').focus();
            }
          });
        } else {
          // auto forwarding not enabled scenario
          this.commonService.setOpenDialog(1);
          const dialogRef = this.dialogService.open(ConfirmationDialogComponent, {
            header: `${this.translateService.instant('Error')}`,
            width: '40em',
            styleClass: 'fileUploadClass',
            style: { direction: localStorage.getItem('langDir') },
            data: { 
              locaKey: response.body.type === 'CUTOFF' ? `${this.translateService.instant('autoForwardDisabledErrorMessage', 
              { date: resp.body.autoForwardDate ,dateType: this.translateService.instant(resp.body.field) })}` 
              : `${this.translateService.instant('autoForwardDisabledHolidayErrorMessage', 
              { date: resp.body.autoForwardDate,dateType: this.translateService.instant(resp.body.field) })}`,
              showAutoForwardButton: false,
              showCancelButton: false,
              showYesButton: false,
              showNoButton: false,
              showReturnButton: showReturnButton,
              showSpacer: true,
              showCloseButton: true
             },
            baseZIndex: 9999,
            autoZIndex: true
          });
          dialogRef.onClose.subscribe((result: any) => {
            this.commonService.isApproveAllowed.next(true);
            if (result.toLowerCase() === 'close') {
              // dialogRef.destroy();
              // set error in preview and form
              this.commonService.isubmitClicked.next(false);
              this.commonService.setOpenDialog(0);
              if (!showReturnButton) {
                this.commonService.highlightError.next({
                  field: resp.body.field === FccGlobalConstant.TRANSFERDATE ?
                  FccGlobalConstant.FT_TRANSFER_DATE : FccGlobalConstant.FT_START_DATE,
                  invalid: true,
                  sectionName: resp.body.field === FccGlobalConstant.TRANSFERDATE ? FccGlobalConstant.FT_TPT_GENERAL_DETAILS :
                  'recurringModel'
                });
              }
            } else if (result.toLowerCase() === 'return') {
              document.getElementById('comments').focus();
              this.commonService.setOpenDialog(0);
            }
          });
        }
      } else {
        this.reauthService.reauthenticate(requestData, FccGlobalConstant.reAuthComponentKey);
      }
    });
  }
}
