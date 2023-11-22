import { Injectable } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { TransactionsListdefComponent } from './../../common/components/transactions-listdef/transactions-listdef.component';
import { FccGlobalConstant } from './../../common/core/fcc-global-constants';
import { SubmissionRequest } from './../../common/model/submissionRequest';
import { SubmitTransaction } from './../../common/model/submitTransaction';
import { SeveralSubmitService } from './../../common/services/several-submit.service';

@Injectable({
  providedIn: 'root'
})
export class ProductListingService {
  selectedRowsdata: string[] = [];
  submissionRequest: SubmissionRequest = {};
  transaction: SubmitTransaction;
  hasSubmissionAccess: boolean;
  enableMultiSubmitResponse: boolean;
  activeItem: {} = {};
  currectTab: any;
  currectTabkey: any = 0;
  disableReturn = false;
  activeIndex: number;
  checkedEnable = true;
  params: {} = {};
  dir: string = localStorage.getItem('langDir');
  changed: boolean;
  tabItems: any = [];
  responseMap;
  multiSubmitForm: UntypedFormGroup;
  comments = '';
  transListdef: TransactionsListdefComponent;

  /**
   * contains map of selected rows with box_ref as key
   * and corresponding rowdata as values
   */
  selectedRowsDataMap:  Map<any, any> = new Map();
  readonly checked = 'checked';
  readonly unchecked = 'unchecked';
  readonly multiCheck = 'multiCheck';
  readonly multiUnCheck = 'multiUnCheck';

  constructor(protected router: Router,
    protected submitService: SeveralSubmitService) {
  }

  onClickMultiApprove(event, comments, selectedRowsdata, context?) {
    if (selectedRowsdata.length) {
      this.enableMultiSubmitResponse = false;
      this.submissionRequest.listKeys = selectedRowsdata;
      // placeholder for comments, to set when implemented in backend
      this.submitService.performSeveralSubmit(this.submissionRequest, FccGlobalConstant.APPROVE, this.getSelectedRowsDataMap());
    }
  }

  onClickMultiReject(event, comments, selectedRowsdata, multiSubmitForm, context?) {
    if (selectedRowsdata.length && multiSubmitForm && multiSubmitForm.controls.comments.value.length > 0) {
      this.enableMultiSubmitResponse = false;
      this.submissionRequest.listKeys = selectedRowsdata;
      this.submissionRequest.comments = comments.value;
      this.submitService.performSeveralSubmit(this.submissionRequest, FccGlobalConstant.REJECT, this.getSelectedRowsDataMap());
      this.disableReturn = false;

    }   else {
    this.disableReturn = true;
   }
  }

/**
 * fetches the selected rows in listing screen
 * @param data contains map of selected rows with listdef box_ref as key.
 * @param context optional placeholder
 */
  getSelectedRowsDataMap(context?) {
    return this.selectedRowsDataMap;
  }

/**
 * based on event add(row select) or remove(row unselect) from selected rows data map.
 * @param event 
 * @param context checked/unchecked 
 */
  setSelectedRowsDataMap(event, context?) {
    if (event) {
      switch(context) {
        case this.checked:
          this.selectedRowsDataMap.set(event.data.box_ref, event.data);
          break;
        case this.unchecked:
          this.selectedRowsDataMap.delete(event.data.box_ref);
          break;
        case this.multiCheck:
          this.selectedRowsDataMap.clear();
          // expired condition?
          event.selectedRows.forEach(t => {
            this.selectedRowsDataMap.set(t.box_ref, t);
          });
          break;
        case this.multiUnCheck:
          this.selectedRowsDataMap.clear();
          break;
      }
    }
  }

}
