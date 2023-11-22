import { ActivatedRoute } from '@angular/router';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ConfirmationService, DynamicDialogRef } from 'primeng';
import { LncdsProductComponent } from '../lncds-product/lncds-product.component';
import { FCCFormGroup } from './../../../../../../base/model/fcc-control.model';
import { FccGlobalConstantService } from './../../../../../../common/core/fcc-global-constant.service';
import { FccGlobalConstant } from './../../../../../../common/core/fcc-global-constants';
import { CommonService } from './../../../../../../common/services/common.service';
import { EventEmitterService } from './../../../../../../common/services/event-emitter-service';
import { ResolverService } from './../../../../../../common/services/resolver.service';
import { SearchLayoutService } from './../../../../../../common/services/search-layout.service';
import { HOST_COMPONENT } from './../../../../../../shared/FCCform/form/form-resolver/form-resolver.directive';
import { ProductStateService } from './../../../../../trade/lc/common/services/product-state.service';
import { CurrencyConverterPipe } from './../../../../../trade/lc/initiation/pipes/currency-converter.pipe';
import { CustomCommasInCurrenciesPipe } from './../../../../../trade/lc/initiation/pipes/custom-commas-in-currencies.pipe';
import { FilelistService } from './../../../../../trade/lc/initiation/services/filelist.service';
import { UtilityService } from './../../../../../trade/lc/initiation/services/utility.service';

@Component({
    selector: 'app-lncds-general-details',
    templateUrl: './lncds-general-details.component.html',
    styleUrls: ['./lncds-general-details.component.scss'],
    providers: [{ provide: HOST_COMPONENT, useExisting: LncdsGeneralDetailsComponent }]
})
export class LncdsGeneralDetailsComponent extends LncdsProductComponent implements OnInit, OnDestroy {

    form: FCCFormGroup;
    module = `${this.translateService.instant('lncdsGeneralDetails')}`;
    contextPath: any;
    tnxTypeCode: any;
    mode: any;
    option: any;
    generalDetailsData: any;

    constructor(
        protected commonService: CommonService,
        protected stateService: ProductStateService, protected translateService: TranslateService,
        protected eventEmitterService: EventEmitterService,
        public fccGlobalConstantService: FccGlobalConstantService, protected confirmationService: ConfirmationService,
        protected customCommasInCurrenciesPipe: CustomCommasInCurrenciesPipe, protected searchLayoutService: SearchLayoutService,
        protected utilityService: UtilityService, protected resolverService: ResolverService,
        protected dialogRef: DynamicDialogRef,
        protected fileArray: FilelistService,
        protected currencyConverterPipe: CurrencyConverterPipe,
        protected activatedRoute: ActivatedRoute,
    ) {
        super(eventEmitterService, stateService, commonService, translateService, confirmationService,
            customCommasInCurrenciesPipe, searchLayoutService, utilityService, resolverService, fileArray,
            dialogRef, currencyConverterPipe);
    }

    ngOnInit(): void {
        super.ngOnInit();
        window.scroll(0, 0);
        this.contextPath = this.fccGlobalConstantService.contextPath;
        this.tnxTypeCode = this.commonService.getQueryParametersFromKey(FccGlobalConstant.TNX_TYPE_CODE);
        this.option = this.commonService.getQueryParametersFromKey(FccGlobalConstant.OPTION);
        this.mode = this.commonService.getQueryParametersFromKey(FccGlobalConstant.MODE);
        this.initializeFormGroup();
        this.fetchBankDetails();
    }

    fetchBankDetails(): void {
        this.commonService.getBankDetails().subscribe(bankDetails => {
            this.patchFieldValueAndParameters(this.form.get(`issuingBankName`), bankDetails[`name`], {});
            this.patchFieldValueAndParameters(this.form.get(`issuingBankAbbvName`), bankDetails[`shortName`], {});
        });
    }

    /**
     * Initialise the form from state service
     */
    initializeFormGroup() {
        this.form = this.stateService.getSectionData(FccGlobalConstant.LNCDS_GENERAL_DETAILS);
        this.setGeneralDetails();
        this.form.updateValueAndValidity();
    }

    ngOnDestroy() {
        this.stateService.setStateSection(FccGlobalConstant.LNCDS_GENERAL_DETAILS, this.form);
    }

   setGeneralDetails(): void {
    this.activatedRoute.queryParams.subscribe(params => {
      const paramsRowData = JSON.parse(params.rowData);
      this.generalDetailsData =
      {
        complianceDocumentId: paramsRowData.document_id,
        complianceDocumentType: paramsRowData.document_type,
        complianceDocumentDate: paramsRowData.docDate,
        complianceDocumentDueDate: paramsRowData.docDueDate,
        complianceDocumentBorrowerRef: paramsRowData.custReference,
        complianceDocumentCustomer: paramsRowData.customer,
        complianceDocumentDealName: paramsRowData['deal/name'] === '-NE-' ? null : paramsRowData['deal/name'],
      };
    });
    Object.keys(this.generalDetailsData).forEach(key => {
            this.patchFieldValueAndParameters(this.form.get(key), this.generalDetailsData[key], {});
        });
    this.commonService.formatForm(this.form);
    this.form.updateValueAndValidity();
    }

}
