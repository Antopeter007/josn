import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { DynamicDialogConfig } from 'primeng';
import { FCCBase } from '../../../../../base/model/fcc-base';
import { FCCFormGroup } from '../../../../../base/model/fcc-control.model';
import { FormControlService } from '../../../../trade/lc/initiation/services/form-control.service';
import { UtilityService } from '../../../../trade/lc/initiation/services/utility.service';
import { CommonService } from '../../../../../common/services/common.service';
import { FormModelService } from '../../../../../common/services/form-model.service';
import { ListDefService } from '../../../../../common/services/listdef.service';
import { FccGlobalConstant } from '../../../../../common/core/fcc-global-constants';
import { HOST_COMPONENT } from './../../../../../shared/FCCform/form/form-resolver/form-resolver.directive';

@Component({
    templateUrl: './interest-details-popup.component.html',
    styleUrls: ['./interest-details-popup.component.scss'],
    providers: [{ provide: HOST_COMPONENT, useExisting: InterestDetailsPopupComponent }]
})
export class InterestDetailsPopupComponent extends FCCBase implements OnInit {
    boRefID;
    loanCCY;
    filterParams: any;
    interestDetailsInputParams: any = {};
    interestDetails: any[] = Array(6).fill({});
    rolloverInterestDetailsXml: string;
    rolloverInterestDetailTablesXml: string;
    showSpinner = false;
    form: FCCFormGroup;
    module = '';
    bankServerDateObj: Date;
    public tableName = 'InterestSchedule';
    constructor(
        protected listService: ListDefService,
        protected dynamicDialogConfig: DynamicDialogConfig,
        protected translate: TranslateService,
        protected formModelService: FormModelService,
        protected formControlService: FormControlService,
        protected utilityService: UtilityService,
        protected commonService: CommonService
    ) {
        super();
    }

    ngOnInit() {
        this.boRefID = this.dynamicDialogConfig.data.boRefId;
        this.loanCCY = this.dynamicDialogConfig.data.loanCCY;
        this.initializeFormGroup();
        this.getInterestDetails();
        this.commonService.addTitleBarCloseButtonAccessibilityControl();
    }

    initializeFormGroup() {
        const totalInterestDueAsPer = 'totalInterestDueAsPer';
        this.commonService.globalBankDate$.subscribe(
          date => {
            this.bankServerDateObj = date;
          }
        );
        const interpolateParams = 'interpolateParams';
        this.formModelService.getSubSectionModelAPI().subscribe((model) => {
            const dialogModel = model[FccGlobalConstant.INTEREST_DETAILS_MODEL];
            dialogModel[totalInterestDueAsPer][interpolateParams] = {
              date: this.utilityService.transformDateFormat(this.bankServerDateObj) };
            this.form = this.formControlService.getFormControls(dialogModel);
        });
    }

    getInterestDetails(): void {
        this.rolloverInterestDetailsXml = 'loan/listdef/customer/LN/inquiryLNRolloverFormInterestDetails';
        this.rolloverInterestDetailTablesXml = 'loan/listdef/customer/LN/inquiryLNRolloverFormInterestCycleUI';

        const filterValues = {};
        const boRefIdKey = 'borefid';
        filterValues[boRefIdKey] = this.boRefID;
        const loanCCYKey = 'loan_ccy';
        filterValues[loanCCYKey] = this.loanCCY;
        this.filterParams = JSON.stringify(filterValues);
        const paginatorParams = {};

        this.listService.getTableData(this.rolloverInterestDetailsXml, this.filterParams, JSON.stringify(paginatorParams))
            .subscribe(result => {
                const tempData = result.rowDetails.map((element) => element.index);
                tempData[0].map((element) => {
                    switch (element.name) {
                        case FccGlobalConstant.INTRESTCYCLEFREQUENCY:
                            this.patchFieldValueAndParameters(this.form.get('interestCycleFrequency'),
                                this.translate.instant(element.value), {});
                            break;
                        case FccGlobalConstant.BASERATE:
                            this.patchFieldValueAndParameters(this.form.get('base_rate'),
                                `${this.translate.instant(element.value)}%`, {});
                            break;
                        case FccGlobalConstant.TOTAL_PROJECT_EOC_AMOUNT:
                            this.patchFieldValueAndParameters(this.form.get('totalInterestDueAsPer'),
                                `${this.loanCCY} ${this.translate.instant(element.value)}`, {});
                            break;
                        case FccGlobalConstant.ALLINRATE:
                            this.patchFieldValueAndParameters(this.form.get('all_in_rate'),
                                `${element.value}%`, {});
                            break;
                        case FccGlobalConstant.SPREAD:
                            this.patchFieldValueAndParameters(this.form.get('spread'),
                                `${element.value}%`, {});
                            break;
                        case FccGlobalConstant.ADDITIONALSPREAD:
                            this.patchFieldValueAndParameters(this.form.get('spread_adjustment'),
                                `${element.value}%`, {});
                    }
                });
            });


        this.listService.getTableData(this.rolloverInterestDetailTablesXml, JSON.stringify(filterValues), JSON.stringify({}))
            .subscribe(result => {
                this.populateTableData(result.rowDetails);
            });
    }

    populateTableData(tableData): void {
        const interestSchedule = [];
        tableData.forEach(element => {
            const objMap: any = {};
            element.index.forEach((ele: any) => {
                objMap[ele.name] = this.commonService.decodeHtml(ele.value);
            });
            interestSchedule.push(objMap);
        });

        this.patchFieldParameters(this.form.get('InterestSchedule'), { data: interestSchedule });
        this.patchFieldParameters(this.form.get('InterestSchedule'), { hasData: true });
    }

}
