import { Constants } from './../../../common/constants';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit} from '@angular/core';
import { IUCommonDataService } from '../common/service/iuCommonData.service';



@Component({
  selector: 'fcc-iu-home',
  templateUrl: './iu-home.component.html'
})
export class IUHomeComponent implements OnInit {

  constructor(protected activatedRoute: ActivatedRoute, protected router: Router,
              protected commonDataService: IUCommonDataService) {

  }


  ngOnInit() {
    this.navigate();
}

  navigate() {
    let mode;
    let tnxType;
    let refId;
    let tnxId;
    let option;
    let subTnxType;
    let templateid;
    let operation;
    let subproductcode;
    let prodStatCode;
    let tnxStatCode;
    this.activatedRoute.queryParams.subscribe(params => {
     mode = params.mode;
     tnxType = params.tnxtype;
     refId = params.referenceid;
     tnxId = params.tnxid;
     option = params.option;
     subTnxType = params.subtnxtype;
     templateid = params.templateid;
     operation = params.operation;
     subproductcode = params.subproductcode;
     prodStatCode = params.prodStatCode;
     tnxStatCode = params.tnxStatCode;
   });
    const previewTnx = '/previewTnx';
    const isPendingAmendRelease = tnxType === '03' && subTnxType === '05' && tnxStatCode !== '04';
    const isAmend = tnxType === '03' && (subTnxType === '01' || subTnxType === '02' || subTnxType === '03');
    if (tnxType === '01' && option === Constants.OPTION_SCRATCH_GUARANTEE) {
      this.router.navigate(['/initiateFromScratch'], {skipLocationChange: true});
    } else if (tnxType === '03' && option === 'EXISTING' && subTnxType === '05') {
      this.router.navigate(['/amendRelease', { refId, option}], {skipLocationChange: true});
    } else if (mode === 'DRAFT' && tnxType === '03' && subTnxType === '05') {
      this.router.navigate(['/editAmendRelease', { refId, tnxId, mode, tnxType}], {skipLocationChange: true});
    } else if ((option === Constants.OPTION_FULL || option === Constants.OPTION_FULLORSUMMARY) && isPendingAmendRelease) {
      this.router.navigate(['/previewAmendRelease',
      { viewMode: 'true', refId, tnxId, masterOrTnx: 'tnx', option}], {skipLocationChange: true});
    } else if (mode === 'DRAFT' && tnxType === '01') {
      this.router.navigate(['/editTnx', { refId, tnxId, mode, tnxType}], {skipLocationChange: true});
    } else if (tnxType === '01' && (option === Constants.OPTION_EXISTING)) {
      this.router.navigate(['/copyFromIU', { refId, option, tnxType}], {skipLocationChange: true});
    } else if (tnxType === '01' && (option === Constants.OPTION_REJECTED)) {
      this.router.navigate(['/copyFromIU', { refId, tnxId , option, tnxType}], {skipLocationChange: true});
    } else if (mode === 'DRAFT' && tnxType === '03' && subTnxType !== '05') {
      this.router.navigate(['/editAmend', { refId, tnxId, mode, tnxType}], {skipLocationChange: true});
    } else if (mode === 'DRAFT' && tnxType === '13') {
      this.router.navigate(['/editMsgToBank', { refId, tnxId, mode, tnxType }], {skipLocationChange: true});
    } else if (option === 'EXISTING' && tnxType === '03') {
     this.router.navigate(['/initiateAmend', { refId}], {skipLocationChange: true});
    } else if ((option === Constants.OPTION_FULL || option === Constants.OPTION_SUMMARY || option === Constants.OPTION_UPDATED
      || option === Constants.OPTION_DETAILS || option === Constants.OPTION_FULLORSUMMARY) && tnxId == null ) {
      this.router.navigate([previewTnx,
      { viewMode: 'true', refId, tnxId: '' , masterOrTnx: 'master', option }], {skipLocationChange: true});
    } else if ((option === Constants.OPTION_FULL || option === Constants.OPTION_SUMMARY || option === Constants.OPTION_UPDATED
      || option === Constants.OPTION_DETAILS || option === Constants.OPTION_FULLORSUMMARY) && (tnxType === '01' && tnxStatCode !== '04')) {
      this.router.navigate([previewTnx, { viewMode: 'true', refId, tnxId, masterOrTnx: 'tnx', option }], {skipLocationChange: true});
    } else if ((option === Constants.OPTION_FULL || option === Constants.OPTION_FULLORSUMMARY || option === Constants.OPTION_SUMMARY
      || option === Constants.OPTION_UPDATED || option === Constants.OPTION_DETAILS) && isAmend) {
      this.commonDataService.setRefId(refId);
      this.commonDataService.setTnxId(tnxId);
      this.commonDataService.setPreviewOption(option);
      this.router.navigate(['/previewAmendComparison', { viewMode: 'true', refId, tnxId, option}], {skipLocationChange: true});
      // Show preview Inquiry for New, Amend Release & Message to Bank, except for Amend after Approval.
    } else if ((option === Constants.OPTION_FULL || option === Constants.OPTION_FULLORSUMMARY || option === Constants.OPTION_SUMMARY
       || option === Constants.OPTION_UPDATED || option === Constants.OPTION_DETAILS) && tnxType === '13' &&
       (subTnxType !== '' || subTnxType !== null)) {
      this.commonDataService.setPreviewOption(option);
      this.router.navigate(['/previewMsgToBank', { viewMode: 'true', refId , tnxId,
            masterOrTnx: 'tnx' , subTnxType, option }], {skipLocationChange: true});
    } else if ((option === Constants.OPTION_FULL || option === Constants.OPTION_SUMMARY || option === Constants.OPTION_UPDATED
      || option === Constants.OPTION_DETAILS || option === Constants.OPTION_FULLORSUMMARY) && (tnxType === Constants.TYPE_REPORTING
        || tnxStatCode === '04')) {
      this.commonDataService.setRefId(refId);
      this.commonDataService.setTnxId(tnxId);
      this.router.navigate(['/previewInquiryTnx', { viewMode: 'true', refId, tnxId, option}], {skipLocationChange: true});
    } else if ((option === Constants.OPTION_FULL || option === Constants.OPTION_FULLORSUMMARY || option === Constants.OPTION_UPDATED
      || option === Constants.OPTION_DETAILS
         || option === Constants.OPTION_SUMMARY) && tnxId != null) {
      this.commonDataService.setViewComments(true);
      this.router.navigate([previewTnx, { viewMode: 'true', refId, tnxId, masterOrTnx: 'tnx', option}], {skipLocationChange: true});
    } else if (option === 'HISTORY' ) {
      this.router.navigate(['/historyConsolidatedSummary', {refId}], {skipLocationChange: true});
    } else if (tnxType === '13' && option === 'CLAIM_PROCESSING') {
      this.router.navigate(['/claimProcessing', { refId, tnxId, option}], {skipLocationChange: true});
    } else if (tnxType === '13' && option === 'CANCEL') {
      this.router.navigate(['/cancellationRequest', { refId, option}], {skipLocationChange: true});
    } else if (tnxType === '13' && option === 'EXISTING') {
      this.router.navigate(['/fromExistingMsgToBank', { refId, option}], {skipLocationChange: true});
    } else if (tnxType === '13' && option === 'ACTION_REQUIRED') {
      this.router.navigate(['/actionRequired', { refId, tnxId, option}], {skipLocationChange: true});
    } else if (mode === Constants.MODE_UNSIGNED && tnxType === '01') {
      this.commonDataService.setMode(Constants.MODE_UNSIGNED);
      this.commonDataService.setRefId(refId);
      this.commonDataService.setTnxId(tnxId);
      this.router.navigate([previewTnx, {refId, tnxId, mode: Constants.MODE_UNSIGNED}], {skipLocationChange: true});
    } else if (mode === Constants.MODE_UNSIGNED && tnxType === '03' && subTnxType === '05') {
      this.commonDataService.setMode(Constants.MODE_UNSIGNED);
      this.commonDataService.setmasterorTnx('tnx');
      this.commonDataService.setRefId(refId);
      this.commonDataService.setTnxId(tnxId);
      this.router.navigate(['/openUnsignedAmendRelease', { mode, refId, tnxId, masterOrTnx: 'tnx'  }], {skipLocationChange: true});
    } else if (mode === Constants.MODE_UNSIGNED && tnxType === '03') {
      this.commonDataService.setMode(Constants.MODE_UNSIGNED);
      this.commonDataService.setmasterorTnx('tnx');
      this.commonDataService.setRefId(refId);
      this.commonDataService.setTnxId(tnxId);
      this.router.navigate(['/openUnsignedAmend', { mode, refId , tnxId, masterOrTnx: 'tnx'  }], {skipLocationChange: true});
    } else if (mode === Constants.MODE_UNSIGNED && tnxType === '13') {
      this.commonDataService.setMode(Constants.MODE_UNSIGNED);
      this.commonDataService.setRefId(refId);
      this.commonDataService.setTnxId(tnxId);
      this.router.navigate(['/previewMsgToBank', { refId, tnxId, mode: Constants.MODE_UNSIGNED}], {skipLocationChange: true});
    } else if (option === Constants.OPTION_TEMPLATE && tnxType === '01') {
      this.router.navigate(['/openTnxFromTemplate', { tnxType, templateid, option,
        subproductcode}], {skipLocationChange: true});
    } else if (option === Constants.OPTION_TEMPLATE && operation ===  Constants.OPERATION_MODIFY_TEMPLATE && templateid != null) {
      this.router.navigate(['/openModifyTemplate', { templateid, option, operation,
        subproductcode}], {skipLocationChange: true});
    } else if (option === Constants.OPTION_TEMPLATE && operation ===  Constants.OPERATION_DELETE_TEMPLATE && templateid != null) {
      this.router.navigate(['/openModifyTemplate', { templateid, option, operation,
        subproductcode}], {skipLocationChange: true});
    }  else if (option === Constants.UPDATE_ENTITY) {
      this.router.navigate(['/updateEntity', {refId, option}], {skipLocationChange: true});
    }  else if (option === Constants.UPDATE_CUSTOMER_REF) {
      this.router.navigate(['/updateCustRef', {refId, option}], {skipLocationChange: true});
    }  else if (option === Constants.CU_PREVIEW) {
      this.router.navigate(['/openCounterUndertakingPreview', { refId }], {skipLocationChange: true});
    }
}

}
