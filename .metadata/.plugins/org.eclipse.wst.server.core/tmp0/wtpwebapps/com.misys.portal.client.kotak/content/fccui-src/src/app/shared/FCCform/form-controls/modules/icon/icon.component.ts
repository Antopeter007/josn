import {
  AfterViewInit,
  Component,
  EventEmitter,
  Output,
  Input,
  OnInit,
} from '@angular/core';
import { FCCBase } from './../../../../../base/model/fcc-base';
import {
  FCCMVFormControl,
  FCCFormGroup,
} from './../../../../../base/model/fcc-control.model';
import {
  IDataEmittterModel,
  IUpdateFccBase,
} from '../../form-control-resolver/form-control-resolver.model';
import { CommonService } from './../../../../../common/services/common.service';
import { ListDataDownloadService } from './../../../../../common/services/list-data-download.service';
import { HideShowDeleteWidgetsService } from './../../../../../common/services/hide-show-delete-widgets.service';
import { FccGlobalConstantService } from './../../../../../common/core/fcc-global-constant.service';
import { FccGlobalConstant } from './../../../../../common/core/fcc-global-constants';
import { TranslateService } from '@ngx-translate/core';
@Component({
  selector: 'fcc-icon',
  templateUrl: './icon.component.html',
  styleUrls: ['./icon.component.scss'],
})
export class IconComponent
  extends FCCBase
  implements OnInit, AfterViewInit, IUpdateFccBase
{
  @Input() control!: FCCMVFormControl;
  @Input() form!: FCCFormGroup;
  @Input() mode!: string;
  @Input() hostComponentData!: any | null;
  @Output() controlDataEmitter: EventEmitter<IDataEmittterModel> =
    new EventEmitter<IDataEmittterModel>();
  compData = new Map<string, any>();
  allowedDownloadOptions = ['PDF', 'EXCEL', 'CSV'];
  widgetDetails: any = [];
  maxColumnForPDFModePortrait: any;
  dateFormatForExcelDownload: any;
  downloadIconPath: string;
  listDataDownloadLimit: any;
  fileName: any;
  
  constructor(protected commonService: CommonService, protected listDataDownloadService: ListDataDownloadService,
    protected hideShowDeleteWidgetsService: HideShowDeleteWidgetsService,
    protected translate: TranslateService,
    protected fccGlobalConstantService:FccGlobalConstantService) {
    super();
  }

  ngOnInit(): void {
    this.commonService.loadDefaultConfiguration().subscribe((response) => {
        this.allowedDownloadOptions = [];
        this.allowedDownloadOptions = response?.listDataDownloadOptions;
        this.maxColumnForPDFModePortrait = response.listDataPDFMaxColForPortraitMode;
        this.dateFormatForExcelDownload = response.listDataExcelDateFormat;
        this.listDataDownloadLimit = response.listDataMaxRecordsDownload;
    });
    this.downloadIconPath = this.fccGlobalConstantService.contextPath + '/content/FCCUI/assets/icons/download-icon.svg';
  }
  ngAfterViewInit(): void {
    this.controlDataEmitter.emit({
      control: this.control,
      data: this.compData,
    });
  }

  onClickDownloadOption(downloadOption: any) {
    const isGroupDataDownload = true;
    const groupDetails = [];
    const tableHeaders = [];

    this.hideShowDeleteWidgetsService.getUserDashboardData('', this.commonService.productNameRoute).then((res) => {
      if (res && res.dashboardDataObject && res.dashboardCategory) {
        const key = (res.dashboardCategory).toUpperCase();
        this.commonService.getBankContextParameterConfiguredValues(FccGlobalConstant.PARAMETER_P850, null, key).subscribe(
          (response) =>{
            this.fileName = this.getConfiguredFileName(response);
          }
        );
        this.widgetDetails = [];
        const widgetDetailsTemp = JSON.parse(JSON.stringify(res?.dashboardDataObject?.widgetDetailsList));

        res?.dashboardDataObject?.widgetDetailsList.forEach((widgetDetail, index) => {
          this.commonService.getTableData(JSON.parse(widgetDetail?.widgetConfig).tableConfig, res?.dashboardCategory,
            this.listDataDownloadLimit).subscribe(result => {
              if (result.count != 0) {
                this.widgetDetails[index] = result;
                tableHeaders[index] = this.commonService.accountSummaryWidgetsColumnDetailsMap.get(widgetDetail?.widgetName);
                groupDetails[index] = widgetDetail?.widgetName;
                groupDetails[FccGlobalConstant.GROUP_TITLE] = this.fileName;
              } else {
                const idx = widgetDetailsTemp.indexOf(widgetDetail, 0);
                widgetDetailsTemp.splice(idx, 1);
              }
              if (this.widgetDetails.filter(x => x !== undefined).length === widgetDetailsTemp.length) {
                this.listDataDownloadService.checkGroupsDownload(downloadOption, isGroupDataDownload, groupDetails, tableHeaders,
                  this.widgetDetails, this.maxColumnForPDFModePortrait,
                  this.dateFormatForExcelDownload, true);
              }
            });
        });
      }
    });
  }
  getConfiguredFileName(response){
    let fileName = this.translate.instant('accountSummary');
    if(response.paramDataList.length > 0){
      const configName = response.paramDataList[0].data_1;
      if(configName && configName !== '**'){
        fileName = this.translate.instant(configName) + ' ' + fileName;
      }
      const companyNameFlag = response.paramDataList[0].data_2 == 'Y' ? true : false;
      if(companyNameFlag){
        const companyName = localStorage.getItem('companyName');
        fileName = companyName + ' ' + fileName;
      }
    }
    return(fileName);
  }
}
