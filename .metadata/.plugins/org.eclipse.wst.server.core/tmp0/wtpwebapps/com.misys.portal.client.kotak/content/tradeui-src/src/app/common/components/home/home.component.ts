import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IUCommonDataService } from '../../../trade/iu/common/service/iuCommonData.service';
import { IUHomeComponent } from '../../../trade/iu/home/iu-home.component';
import { RUHomeComponent } from '../../../trade/ru/home/ru-home.component';
import { Constants } from '../../constants';
import { CommonDataService } from '../../services/common-data.service';
import { ReportingFromPendingComponent } from '../../../bank/reporting-from-pending/reporting-from-pending.component';
import { ConfigService } from '../../services/config.service';


@Component({
  selector: 'fcc-common-home',
  templateUrl: './home.component.html'
})
export class HomeComponent implements OnInit {

  constructor(public activatedRoute: ActivatedRoute, public router: Router,
              public commonData: CommonDataService, public commonDataService: IUCommonDataService,
              protected configService: ConfigService) {}

  @ViewChild(IUHomeComponent) iuHomeComponent: IUHomeComponent;
  @ViewChild(RUHomeComponent) ruHomeComponent: RUHomeComponent;
  @ViewChild(ReportingFromPendingComponent) reportingFromPendingComponent: ReportingFromPendingComponent;

  ngOnInit() {
    this.navigate();
  }

  navigate() {
    let productcode;
    let isBankUser;
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
    let featureid;
    let type;
    let companyid;
    this.activatedRoute.queryParams.subscribe(params => {
     mode = params.mode;
     tnxType = params.tnxtype;
     refId = params.referenceid;
     tnxId = params.tnxid;
     option = params.option;
     subTnxType = params.subtnxtype;
     templateid = params.templateid;
     operation = params.operation;
     productcode = params.productcode;
     subproductcode = params.subproductcode;
     prodStatCode = params.prodStatCode;
     tnxStatCode = params.tnxStatCode;
     featureid = params.featureid;
     type = params.type;
     companyid = params.companyid;
   });

    productcode = this.commonData.getProductCode();
    isBankUser = this.commonData.getIsBankUser();

    if (!isBankUser) {
      if (productcode === 'BG') {
      const isPendingAmendRelease = tnxType === '03' && subTnxType === '05' && tnxStatCode !== '04';
      const isAmend = tnxType === '03' && (subTnxType === '01' || subTnxType === '02' || subTnxType === '03');
      if (tnxType === '01' && option === Constants.SCRATCH && (featureid !== '' && featureid != null)) {
        this.commonData.setOption(Constants.SCRATCH);
        this.commonDataService.setOption(Constants.SCRATCH);
        this.commonDataService.setTnxType(Constants.TYPE_NEW);
        this.commonDataService.setBankTemplateID(featureid);
        this.commonDataService.setTemplateUndertakingType(type);
        this.commonDataService.setIsFromBankTemplateOption(true);
        this.router.navigate([Constants.FROM_BANK_TEMPLATE_OPTION, { tnxType, featureid, option, companyid}], {skipLocationChange: true});
      } else if (tnxType === '01' && option === Constants.OPTION_SCRATCH_GUARANTEE) {
        this.commonDataService.setTnxType(Constants.TYPE_NEW);
        this.router.navigate(['/initiateFromScratch'], {skipLocationChange: true});
      } else if (tnxType === '03' && option === 'EXISTING' && subTnxType === '05') {
        this.router.navigate(['/amendRelease', { refId, option}], {skipLocationChange: true});
      } else if (mode === 'DRAFT' && tnxType === '03' && subTnxType === '05') {
        this.router.navigate(['/editAmendRelease', { refId, tnxId, mode, tnxType}], {skipLocationChange: true});
      } else if ((option === Constants.OPTION_FULL || option === Constants.OPTION_FULLORSUMMARY || option === Constants.OPTION_SUMMARY
        || option === Constants.OPTION_DETAILS || option === Constants.OPTION_UPDATED) && isPendingAmendRelease) {
        this.commonDataService.setPreviewOption(option);
        this.router.navigate(['/previewAmendRelease', { viewMode: 'true', refId , tnxId , masterOrTnx: 'tnx', option }],
        {skipLocationChange: true});
      } else if (mode === 'DRAFT' && tnxType === '01') {
        this.router.navigate(['/editTnx', { refId, tnxId, mode, tnxType}], {skipLocationChange: true});
      } else if (tnxType === '01' && (option === Constants.OPTION_EXISTING)) {
        this.commonDataService.setTnxType(Constants.TYPE_NEW);
        this.router.navigate(['/copyFromIU', { refId, option, tnxType}], {skipLocationChange: true});
      } else if (tnxType === '01' && (option === Constants.OPTION_REJECTED)) {
        this.commonDataService.setTnxType(Constants.TYPE_NEW);
        this.router.navigate(['/copyFromIU', { refId, tnxId , option, tnxType}], {skipLocationChange: true});
      } else if (mode === 'DRAFT' && tnxType === '03' && subTnxType !== '05') {
        this.router.navigate(['/editAmend', { refId, tnxId, mode, tnxType}], {skipLocationChange: true});
      } else if (mode === 'DRAFT' && tnxType === '13') {
        this.router.navigate(['/editMsgToBank', { refId, tnxId, mode, tnxType }], {skipLocationChange: true});
      } else if (option === 'EXISTING' && tnxType === '03') {
        this.router.navigate(['/initiateAmend', { refId}], {skipLocationChange: true});
      } else if ((option === Constants.OPTION_FULL || option === Constants.OPTION_SUMMARY || option === Constants.OPTION_UPDATED
        || option === Constants.OPTION_DETAILS || option === Constants.OPTION_FULLORSUMMARY) && tnxId == null && productcode === 'BG') {
        this.router.navigate([Constants.PREVIEW_TNX, { viewMode: 'true', refId , tnxId: '' , masterOrTnx: 'master', option }],
        {skipLocationChange: true});
      } else if ((option === Constants.OPTION_FULL || option === Constants.OPTION_FULLORSUMMARY || option === Constants.OPTION_SUMMARY
        || option === Constants.OPTION_UPDATED || option === Constants.OPTION_DETAILS) && isAmend) {
        this.commonDataService.setRefId(refId);
        this.commonDataService.setTnxId(tnxId);
        this.commonDataService.setPreviewOption(option);
        this.commonDataService.setViewComments(true);
        this.router.navigate([Constants.TWO_COL_AMEND_PREVIEW, { viewMode: 'true', refId , tnxId, option}], {skipLocationChange: true});
        // Show preview Inquiry for New, Amend Release & Message to Bank, except for Amend after Approval.
      } else if ((option === Constants.OPTION_FULL || option === Constants.OPTION_FULLORSUMMARY || option === Constants.OPTION_SUMMARY
        || option === Constants.OPTION_UPDATED || option === Constants.OPTION_DETAILS) && tnxType === '13'
        && (subTnxType !== '' || subTnxType !== null)) {
        this.commonDataService.setPreviewOption(option);
        this.commonDataService.setViewComments(true);
        this.router.navigate(['/previewMsgToBank', { viewMode: 'true', refId , tnxId ,
        masterOrTnx: 'tnx' , subTnxType, option }], {skipLocationChange: true});
      } else if ((option === Constants.OPTION_FULL || option === Constants.OPTION_SUMMARY || option === Constants.OPTION_UPDATED
        || option === Constants.OPTION_DETAILS || option === Constants.OPTION_FULLORSUMMARY)
        && (tnxType === Constants.TYPE_REPORTING || tnxStatCode === '04')) {
        this.commonDataService.setRefId(refId);
        this.commonDataService.setTnxId(tnxId);
        this.commonDataService.setPreviewOption(option);
        this.router.navigate(['/previewInquiryTnx', { viewMode: 'true', refId , tnxId, option}], {skipLocationChange: true});
      } else if ((option === Constants.OPTION_FULL || option === Constants.OPTION_FULLORSUMMARY || option === Constants.OPTION_UPDATED
        || option === Constants.OPTION_DETAILS || option === Constants.OPTION_SUMMARY) && (tnxId != null ||
        (tnxType === '01' && tnxStatCode !== '04'))) {
        this.commonDataService.setViewComments(true);
        this.commonDataService.setTnxId(tnxId);
        this.router.navigate([Constants.PREVIEW_TNX, { viewMode: 'true', refId , tnxId , masterOrTnx: 'tnx', option }],
        {skipLocationChange: true});
      } else if (option === 'HISTORY' && productcode === 'BG') {
        this.router.navigate(['/historyConsolidatedSummary', {refId, productcode}], {skipLocationChange: true});
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
        this.router.navigate([Constants.PREVIEW_TNX, {refId , tnxId, mode: Constants.MODE_UNSIGNED}], {skipLocationChange: true});
      } else if (mode === Constants.MODE_UNSIGNED && tnxType === '03' && subTnxType === '05') {
        this.commonDataService.setMode(Constants.MODE_UNSIGNED);
        this.commonDataService.setmasterorTnx('tnx');
        this.commonDataService.setRefId(refId);
        this.commonDataService.setTnxId(tnxId);
        this.router.navigate(['/openUnsignedAmendRelease', { mode, refId , tnxId , masterOrTnx: 'tnx'  }], {skipLocationChange: true});
      } else if (mode === Constants.MODE_UNSIGNED && tnxType === '03') {
        this.commonDataService.setMode(Constants.MODE_UNSIGNED);
        this.commonDataService.setmasterorTnx('tnx');
        this.commonDataService.setRefId(refId);
        this.commonDataService.setTnxId(tnxId);
        this.router.navigate(['/openUnsignedAmend', { mode, refId , tnxId , masterOrTnx: 'tnx'  }], {skipLocationChange: true});
      } else if (mode === Constants.MODE_UNSIGNED && tnxType === '13') {
        this.commonDataService.setMode(Constants.MODE_UNSIGNED);
        this.commonDataService.setRefId(refId);
        this.commonDataService.setTnxId(tnxId);
        this.router.navigate(['/previewMsgToBank', { refId , tnxId, mode: Constants.MODE_UNSIGNED}], {skipLocationChange: true});
      } else if (option === Constants.OPTION_TEMPLATE && tnxType === '01') {
        this.router.navigate(['/openTnxFromTemplate', { tnxType, templateid, option,
          subproductcode}], {skipLocationChange: true});
      } else if (option === Constants.OPTION_TEMPLATE && (operation === Constants.OPERATION_MODIFY_TEMPLATE
        || operation === Constants.OPERATION_DELETE_TEMPLATE) && templateid != null) {
        this.router.navigate(['/openModifyTemplate', { templateid, option, operation,
          subproductcode}], {skipLocationChange: true});
      }  else if (option === Constants.UPDATE_ENTITY) {
        this.router.navigate(['/updateEntity', {refId , option}], {skipLocationChange: true});
      }  else if (option === Constants.UPDATE_CUSTOMER_REF) {
        this.router.navigate(['/updateCustRef', {refId , option}], {skipLocationChange: true});
      }  else if (option === Constants.CU_PREVIEW) {
        this.router.navigate(['/openCounterUndertakingPreview', { refId }], {skipLocationChange: true});
      }
    } else if (productcode === Constants.PRODUCT_CODE_RU) {
        this.commonData.setProductCode(Constants.PRODUCT_CODE_RU);
        if (option === 'HISTORY' && productcode === Constants.PRODUCT_CODE_RU) {
          this.commonData.setDisplayMode('view');
          this.commonData.setOption(Constants.OPTION_HISTORY);
          this.router.navigate(['ru/historyConsolidatedSummary', {refId, productcode}], {skipLocationChange: true});
        } else if (option === Constants.OPTION_FULL && tnxId == null && productcode === Constants.PRODUCT_CODE_RU) {
        this.router.navigate([Constants.RU_PREVIEW_TNX, { viewMode: 'true', refId , tnxId: '' , masterOrTnx: 'master' ,
                              productcode }], {skipLocationChange: true});
        } else if (option === Constants.OPTION_EXISTING && tnxType === '13') {
          this.router.navigate(['ru/fromExistingMsgToBank', {refId, option}], {skipLocationChange: true});
        } else if (mode === Constants.MODE_DRAFT && tnxType === '13') {
          this.router.navigate(['ru/editMsgToBank', {refId, tnxId, mode, tnxType}], {skipLocationChange: true});
        } else if (option === Constants.OPTION_ACTION_REQUIRED) {
          this.router.navigate(['ru/actionRequired', { refId, tnxId, option}], {skipLocationChange: true});
        } else if ((option ===  Constants.OPTION_FULL || option === Constants.OPTION_FULLORSUMMARY || option === Constants.OPTION_SUMMARY)
                    && tnxType === '13' &&
                    (subTnxType !== '' && subTnxType != null)) {
          this.commonData.setViewComments(true);
          this.router.navigate(['ru/previewMsgToBank', { viewMode: 'true', refId , tnxId , masterOrTnx: 'tnx' , subTnxType }],
          {skipLocationChange: true});
        } else if ((option === Constants.OPTION_FULL || option === Constants.OPTION_FULLORSUMMARY)
                    && tnxId != null && productcode === 'BR') {
          this.commonData.setViewComments(true);
          this.router.navigate([Constants.RU_PREVIEW_TNX, { viewMode: 'true', refId, tnxId, masterOrTnx: 'tnx', productcode}],
          {skipLocationChange: true});
        } else if (mode === Constants.MODE_UNSIGNED && tnxType === '13') {
          this.commonData.setMode(Constants.MODE_UNSIGNED);
          this.commonData.setRefId(refId);
          this.commonData.setTnxId(tnxId);
          this.router.navigate(['ru/previewMsgToBank', { refId , tnxId, mode: Constants.MODE_UNSIGNED}], {skipLocationChange: true});
        } else if (option === Constants.UPDATE_ENTITY) {
          this.router.navigate(['ru/updateEntity', {refId , option}], {skipLocationChange: true});
        } else if (option === Constants.UPDATE_CUSTOMER_REF) {
          this.router.navigate(['ru/updateCustRef', {refId , option}], {skipLocationChange: true});
        }
      }
    } else if (isBankUser) {
      this.configService.setCounterUndertakingEnabled(true);
      const isAmend = tnxType === '03' && (subTnxType === '01' || subTnxType === '02' || subTnxType === '03');
      const isExistingBGAmend = (tnxType === Constants.TYPE_REPORTING && prodStatCode === '08');
      if (productcode === 'BG') {
        if (option === Constants.SCRATCH && operation === Constants.OPERATION_CREATE_REPORTING) {
          this.commonData.setOption(Constants.SCRATCH);
          this.router.navigate(['/createReportingPendingIU', {refId , tnxId}], {skipLocationChange: true});
        } else if (mode === Constants.MODE_DRAFT && tnxType !== Constants.TYPE_REPORTING) {
          this.commonData.setMode(Constants.MODE_DRAFT);
          this.router.navigate(['/editFromPendingTnx', { refId, tnxId, mode, tnxType}], {skipLocationChange: true});
        } else if ((option === Constants.OPTION_FULL || option === Constants.OPTION_FULLORSUMMARY || option === Constants.OPTION_SUMMARY
          || option === Constants.OPTION_UPDATED || option === Constants.OPTION_DETAILS) && (isAmend || isExistingBGAmend)) {
          this.commonDataService.setRefId(refId);
          this.commonDataService.setTnxId(tnxId);
          this.commonDataService.setPreviewOption(option);
          this.commonDataService.setViewComments(true);
          this.commonData.setDisplayMode('view');
          this.router.navigate([Constants.TWO_COL_AMEND_PREVIEW, { viewMode: 'true', refId , tnxId, option}], {skipLocationChange: true});
        } else if (option === Constants.OPTION_FULLORSUMMARY && tnxId !== null) {
          this.commonDataService.setPreviewOption(Constants.OPTION_SUMMARY);
          this.commonData.setDisplayMode('view');
          this.router.navigate([Constants.PREVIEW_FROM_PENDING_TNX,
          { viewMode: 'true', refId , tnxId , masterOrTnx: 'tnx', option: Constants.OPTION_SUMMARY}],
                                {skipLocationChange: true});
        } else if (operation === Constants.OPERATION_CREATE_REPORTING && option === Constants.OPTION_EXISTING) {
          this.commonData.setOption(Constants.OPTION_EXISTING);
          this.commonData.setOperation(Constants.OPERATION_CREATE_REPORTING);
          this.commonDataService.setOption(Constants.OPTION_EXISTING);
          this.router.navigate(['/reportingFromExisting', {refId}], {skipLocationChange: true});
        } else if ((option === Constants.OPTION_FULL) && tnxId == null) {
          this.router.navigate(['iu/previewExisting', {viewMode: 'true', refId , tnxId: '', masterOrTnx: 'master', option }],
                                {skipLocationChange: true});
        } else if ((option === Constants.OPTION_FULL || option === Constants.OPTION_SUMMARY) &&
                    tnxId !== null && tnxType !== Constants.TYPE_REPORTING) {
          this.commonDataService.setDisplayMode(Constants.MODE_VIEW);
          this.commonData.setDisplayMode(Constants.MODE_VIEW);
          this.router.navigate([Constants.PREVIEW_FROM_PENDING_TNX, { viewMode: 'true', refId , tnxId , masterOrTnx: 'tnx', option }],
                                {skipLocationChange: true});
        } else if ((option === Constants.OPTION_FULL) && tnxId !== null) {
          this.router.navigate(['/previewExistingTnx', { viewMode: 'true', refId , tnxId , masterOrTnx: 'tnx', option }],
                                {skipLocationChange: true});
        } else if (mode === Constants.MODE_DRAFT && tnxType === Constants.TYPE_REPORTING) {
          this.router.navigate(['/editExistingTnx', { refId, tnxId, mode, tnxType}], {skipLocationChange: true});
        } else if (mode === Constants.MODE_UNSIGNED && tnxType === Constants.TYPE_REPORTING) {
          this.commonDataService.setMode(Constants.MODE_UNSIGNED);
          this.commonDataService.setRefId(refId);
          this.commonDataService.setTnxId(tnxId);
          this.router.navigate(['/unsignedExistingTnx', { refId, tnxId, mode, tnxType}], {skipLocationChange: true});
        } else if (mode === Constants.MODE_UNSIGNED && !tnxType) {
          this.commonDataService.setMode(Constants.MODE_UNSIGNED);
          this.commonDataService.setRefId(refId);
          this.commonDataService.setTnxId(tnxId);
          this.router.navigate(['/unsignedPendingTnx', { viewMode: 'true', refId, tnxId,
          masterOrTnx: 'tnx', mode, tnxType}], {skipLocationChange: true});
        } else if (mode === Constants.MODE_RELEASE && operation === Constants.OPERATION_CREATE_RELEASEREJECT_REPORTING) {
          this.commonDataService.setMode(Constants.MODE_RELEASE);
          this.commonDataService.setRefId(refId);
          this.commonDataService.setTnxId(tnxId);
          this.router.navigate(['/releaseRejectPendingTnx', { viewMode: 'true', refId, tnxId,
          masterOrTnx: 'tnx', mode, tnxType}], {skipLocationChange: true});
        } else if (option === 'HISTORY' && operation === Constants.OPERATION_LIST_INQUIRY) {
          this.router.navigate(['/historyConsolidatedSummary', {refId, productcode}], {skipLocationChange: true});
          this.commonDataService.setOption(Constants.OPTION_HISTORY);
        } else if (operation === Constants.TASKS_MONITORING) {
          this.commonDataService.setRefId(refId);
          this.commonDataService.setTnxId(tnxId);
          this.commonData.setOperation(Constants.TASKS_MONITORING);
          this.router.navigate(['/tasksMonitoring', { viewMode: 'true', refId, tnxId, operation,
          masterOrTnx: 'tnx'}], {skipLocationChange: true});
        }
      } else if (productcode === 'BR') {
        this.commonData.setProductCode(Constants.PRODUCT_CODE_RU);
        const isExistingBRAmend = (tnxType === Constants.TYPE_REPORTING && prodStatCode === '08');
        if (tnxType === '01' && option === Constants.SCRATCH ) {
          this.router.navigate([Constants.MO_INITIATE_SCRATCH], {skipLocationChange: true});
        } else if (mode === Constants.MODE_DRAFT && tnxType === Constants.TYPE_NEW) {
          this.router.navigate([Constants.MO_INITIATE_SCRATCH, { refId, tnxId, mode, tnxType}], {skipLocationChange: true});
        } else if (mode === Constants.MODE_DRAFT && tnxType !== Constants.TYPE_REPORTING) {
          this.commonData.setMode(Constants.MODE_DRAFT);
          this.router.navigate(['/editFromPendingTnx', { refId, tnxId, mode, tnxType}], {skipLocationChange: true});
        } else if ((option === Constants.OPTION_FULL || option === Constants.OPTION_FULLORSUMMARY || option === Constants.OPTION_SUMMARY ||
           option === Constants.OPTION_DETAILS) && tnxType === '01' && tnxId == null) {
            this.router.navigate([Constants.MO_INITIATE_SCRATCH, {viewMode: 'true', refId , tnxId: '', masterOrTnx: 'master', option }],
            {skipLocationChange: true});
        } else if ((option === Constants.OPTION_FULL || option === Constants.OPTION_FULLORSUMMARY || option === Constants.OPTION_SUMMARY
          || option === Constants.OPTION_UPDATED || option === Constants.OPTION_DETAILS) && isExistingBRAmend) {
          this.commonDataService.setRefId(refId);
          this.commonDataService.setTnxId(tnxId);
          this.commonDataService.setPreviewOption(option);
          this.commonDataService.setViewComments(true);
          this.commonData.setDisplayMode('view');
          this.router.navigate([Constants.TWO_COL_AMEND_PREVIEW, { viewMode: 'true', refId , tnxId, option}], {skipLocationChange: true});
        } else if ((option === Constants.OPTION_FULL || option === Constants.OPTION_FULLORSUMMARY || option === Constants.OPTION_SUMMARY ||
          option === Constants.OPTION_DETAILS) && tnxType === '01' && tnxId != null) {
           this.router.navigate([Constants.MO_INITIATE_SCRATCH, {viewMode: 'true', refId , tnxId, masterOrTnx: 'tnx', option }],
           {skipLocationChange: true});
          } else if (option === Constants.SCRATCH && operation === Constants.OPERATION_CREATE_REPORTING) {
            this.commonData.setOption(Constants.SCRATCH);
            this.router.navigate(['/createReportingPendingIU', {refId , tnxId}], {skipLocationChange: true});
          } else if (operation === Constants.OPERATION_CREATE_REPORTING && option === Constants.OPTION_EXISTING) {
            this.commonData.setOption(Constants.OPTION_EXISTING);
            this.commonData.setOperation(Constants.OPERATION_CREATE_REPORTING);
            this.commonDataService.setOption(Constants.OPTION_EXISTING);
            this.commonDataService.setTnxType(Constants.TYPE_REPORTING);
            this.router.navigate(['/reportingFromExisting', {refId}], {skipLocationChange: true});
          } else if (mode === Constants.MODE_DRAFT && tnxType === Constants.TYPE_REPORTING) {
            this.commonData.setMode(Constants.MODE_DRAFT);
            this.commonDataService.setMode(Constants.MODE_DRAFT);
            this.router.navigate(['/editExistingTnx', { refId, tnxId, mode, tnxType}], {skipLocationChange: true});
          } else if (mode === Constants.MODE_UNSIGNED && tnxType === Constants.TYPE_REPORTING) {
            this.commonDataService.setMode(Constants.MODE_UNSIGNED);
            this.commonDataService.setRefId(refId);
            this.commonDataService.setTnxId(tnxId);
            this.router.navigate(['/unsignedExistingTnx', { refId, tnxId, mode, tnxType}], {skipLocationChange: true});
          } else if (mode === Constants.MODE_UNSIGNED && tnxType === Constants.TYPE_NEW) {
            this.commonDataService.setMode(Constants.MODE_UNSIGNED);
            this.commonDataService.setRefId(refId);
            this.commonDataService.setTnxId(tnxId);
            this.router.navigate(['ru/retriveUnsigned', { refId, tnxId, mode, tnxType}], {skipLocationChange: true});
          } else if (mode === Constants.MODE_UNSIGNED && !tnxType) {
            this.commonDataService.setMode(Constants.MODE_UNSIGNED);
            this.commonDataService.setRefId(refId);
            this.commonDataService.setTnxId(tnxId);
            this.router.navigate(['/unsignedPendingTnx', { viewMode: 'true', refId, tnxId,
            masterOrTnx: 'tnx', mode, tnxType}], {skipLocationChange: true});
          } else if ((option === Constants.OPTION_FULL) && tnxId !== null && tnxType === Constants.TYPE_INQUIRE) {
            this.commonDataService.setDisplayMode(Constants.MODE_VIEW);
            this.commonData.setDisplayMode(Constants.MODE_VIEW);
            this.router.navigate([Constants.PREVIEW_FROM_PENDING_TNX, { viewMode: 'true', refId , tnxId , masterOrTnx: 'tnx', option }],
                      {skipLocationChange: true});
          } else if ((option === Constants.OPTION_FULL) && (tnxId !== null && tnxId !== undefined)) {
            this.router.navigate(['/previewExistingTnx', { viewMode: 'true', refId , tnxId , masterOrTnx: 'tnx', option }],
                                  {skipLocationChange: true});
          } else if ((option === Constants.OPTION_FULL) && tnxId == null) {
            this.router.navigate(['ru/previewExisting', {viewMode: 'true', refId , tnxId: '', masterOrTnx: 'master', option }],
                                  {skipLocationChange: true});
          } else if ((option === Constants.OPTION_SUMMARY) && tnxId != null) {
          this.commonData.setDisplayMode(Constants.MODE_VIEW);
          this.router.navigate([Constants.PREVIEW_FROM_PENDING_TNX, { viewMode: 'true', refId , tnxId , masterOrTnx: 'tnx', option }],
                                {skipLocationChange: true});
          } else if (option === Constants.OPTION_FULLORSUMMARY && tnxId !== null) {
          this.commonDataService.setPreviewOption(Constants.OPTION_SUMMARY);
          this.commonData.setDisplayMode(Constants.MODE_VIEW);
          this.router.navigate([Constants.PREVIEW_FROM_PENDING_TNX,
          { viewMode: 'true', refId , tnxId , masterOrTnx: 'tnx', option: Constants.OPTION_SUMMARY}],
                                {skipLocationChange: true});
          }  else if (mode === Constants.MODE_RELEASE && operation === Constants.OPERATION_CREATE_RELEASEREJECT_REPORTING) {
            this.commonDataService.setMode(Constants.MODE_RELEASE);
            this.commonDataService.setRefId(refId);
            this.commonDataService.setTnxId(tnxId);
            this.router.navigate(['/releaseRejectPendingTnx', { viewMode: 'true', refId, tnxId,
            masterOrTnx: 'tnx', mode, tnxType}], {skipLocationChange: true});
          } else if (option === 'HISTORY' && operation === Constants.OPERATION_LIST_INQUIRY) {
            this.router.navigate(['ru/historyConsolidatedSummary', {refId, productcode}], {skipLocationChange: true});
            this.commonDataService.setOption(Constants.OPTION_HISTORY);
          } else if (operation === Constants.TASKS_MONITORING) {
            this.commonDataService.setRefId(refId);
            this.commonDataService.setTnxId(tnxId);
            this.commonData.setOperation(Constants.TASKS_MONITORING);
            this.router.navigate(['/tasksMonitoring', { viewMode: 'true', refId, tnxId, operation,
            masterOrTnx: 'tnx'}], {skipLocationChange: true});
          }
        }
      }
    }
  }
