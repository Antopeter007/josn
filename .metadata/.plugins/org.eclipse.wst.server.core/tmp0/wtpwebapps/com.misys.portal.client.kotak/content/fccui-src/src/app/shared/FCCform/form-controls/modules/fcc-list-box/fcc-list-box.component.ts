import { FCCBase } from './../../../../../base/model/fcc-base';
import { FCCFormGroup, FCCMVFormControl } from './../../../../../base/model/fcc-control.model';
import { AfterViewInit, Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { IDataEmittterModel, IUpdateFccBase } from '../../form-control-resolver/form-control-resolver.model';
import { CommonService } from '../../../../../common/services/common.service';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { TranslateService } from '@ngx-translate/core';
import { FccOverlayService } from './../../../../../base/services/fcc-overlay.service';
import { OverlayPanel } from 'primeng';
import { EventsFilterPopupComponent } from '../../../../../common/components/events-filter-popup/events-filter-popup.component';
import { ListDefService } from '../../../../../common/services/listdef.service';
import { FormService } from '../../../../../common/services/listdef-form-service';
import { FccGlobalConstant } from "../../../../../common/core/fcc-global-constants";
import { PreviewService } from '../../../../../corporate/trade/lc/initiation/services/preview.service';

@Component({
  selector: 'fcc-list-box',
  templateUrl: './fcc-list-box.component.html',
  styleUrls: ['./fcc-list-box.component.scss'],
})

export class FccListBoxComponent extends FCCBase
implements OnInit, AfterViewInit, IUpdateFccBase, OnDestroy {

    @Input() control!: FCCMVFormControl;
    @Input() form!: FCCFormGroup;
    @Input() mode!: string;
    @Input() hostComponentData!: any | null;
    @Output() controlDataEmitter: EventEmitter<IDataEmittterModel> =
      new EventEmitter<IDataEmittterModel>();
    compData = new Map<string, any>();
    @Input() listdefName: any;
    @Input() refId: any;
    contextPath;
    @Input() eventsListFilterSectionJson;
    @Input() eventsListColumns;
    //@Input() eventsTableData : any[];
    @Input() pageSizeOptions : number[];
    @Output() selectEvent: EventEmitter<any> = new EventEmitter<any>();
    @Output() eventsFilterParams: EventEmitter<any> = new EventEmitter<any>();
    dataSource = new MatTableDataSource<any>([]);
    selectedRowIndex;
    @Input() listBoxSortData;
    @ViewChild('op') sortOverlayPanel: OverlayPanel;
    @ViewChild(EventsFilterPopupComponent) public eventsFilterComponent: EventsFilterPopupComponent;
    @ViewChild(MatPaginator, { static: false })
    set paginator(value: MatPaginator) {
      if (this.dataSource){
        this.dataSource.paginator = value;
      }
    }
    @ViewChild(MatSort) sort: MatSort;
    dir: string = localStorage.getItem('langDir');
    pages:number;
    pageLength: number; // Total Number of records
    pageSize: number; // Number of records per page
    @Output() sortEvent:EventEmitter<any>=new EventEmitter<any>();
    @Input() eventDataEmit:EventEmitter<any>;
    sortByLabel:string;
    filterApplied = false; // Used to highlight the filter icon when filter is applied

    currentFilteredFormData: any;
    eventActionIcon:any;
    resData:any[];
    eventActionIconGrey: string;
    tnxCurrency: string;

  constructor(protected commonService: CommonService, protected translate: TranslateService,
    protected fccOverlayService: FccOverlayService, protected listService: ListDefService,
    protected listdefFormService: FormService,protected paginatorIntl: MatPaginatorIntl,
    protected previewService:PreviewService) {
    super();
    paginatorIntl.itemsPerPageLabel = this.translate.instant('rows_per_page');
    paginatorIntl.nextPageLabel = this.translate.instant("nextPage");
    paginatorIntl.previousPageLabel = this.translate.instant("previousPage");
    paginatorIntl.firstPageLabel = this.translate.instant("goToFirstPage");
    paginatorIntl.lastPageLabel = this.translate.instant("goToLastPage");

    this.setPaginatorShowingRecordsContent();
    this.sortByLabel = this.translate.instant("Event_SORT_TXT");
  }
  ngOnDestroy(): void {
    this.fccOverlayService.onCloseOverlay.next(null);
    this.listdefFormService.eventsFilterParamsCount = 1;
    this.filterApplied = false;
  }

  setPaginatorShowingRecordsContent() {
    this.paginatorIntl.getRangeLabel = (page: number, pageSize: number, pageLength: number) => {
      if (pageLength === 0 || pageSize === 0) {
        return this.translate.instant('showMessage')+` 0 - 0 `+this.translate.instant('of')+` ${pageLength} `
      +this.translate.instant('records');
      }
      pageLength = Math.max(pageLength, 0);
      const startIndex = page * pageSize;
      const endIndex = startIndex < pageLength ? Math.min(startIndex + pageSize, pageLength) : startIndex + pageSize;
      return this.translate.instant('showMessage')+` ${startIndex + 1} - ${endIndex} `+this.translate.instant('of')+` ${pageLength} `
      +this.translate.instant('records');
    };
  }

  ngOnInit() {
    this.contextPath = this.commonService.getContextPath();
    // To highlight the first event in list as selected.
    this.selectedRowIndex = 0;
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.eventActionIcon = this.contextPath + '/content/FCCUI/assets/icons/pendingActionFuchsia.svg';
    this.eventActionIconGrey = this.contextPath + '/content/FCCUI/assets/icons/pendingActionGrey.svg';
  }

  ngAfterViewInit(): void {
    this.fccOverlayService.onCloseOverlay.subscribe(params => {
      if (params && params.controls) {
        this.currentFilteredFormData = params.value;
        this.applyAdvancedFilter(params);
      }
    });
    //setting data to event list
     this.eventDataEmit.subscribe((eventTableData)=>{
      eventTableData.forEach((res)=>{
        if (res['CrossReference@child_tnx_id'] === null) {
          res['Event_Action'] = res['CrossReference@child_tnx_id'];
        }
           if(this.commonService.isnonEMptyString(res['tnx_cur_code'])){
                    this.tnxCurrency = res['tnx_cur_code'];
           }
      });
      this.dataSource.data = eventTableData;
      this.dataSource.paginator.firstPage();
      setTimeout(() => {
        this.updatePaginator();
      }, FccGlobalConstant.LENGTH_2000);
      if (this.listdefFormService.eventsFilterParamsCount > 1) {
        this.filterApplied = true;
      } else {
        this.filterApplied = false;
      }
      this.controlDataEmitter.emit({
        control: this.control,
        data: this.compData,
      });
    });
  }

  updatePaginator() {
    this.dataSource.paginator.page.next({
      pageIndex: this.dataSource.paginator.pageIndex,
      pageSize: this.dataSource.paginator.pageSize,
      length: this.dataSource.paginator.length
    });
  }

  // Used for in-line text search
  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
      setTimeout(() => {
        this.updatePaginator();
      }, FccGlobalConstant.LENGTH_1000);
    }
  }

  onClickFilter(){
    const title = this.translate.instant('filter');
    const overlayConfig = {
      styleClass: 'eventFilterPopup',
      showHeader: true,
      header: title,
      dir: this.dir,
      data: {
        componentName: 'fccEventsFilterPopup',
        filterSectionJson: this.eventsListFilterSectionJson,
        previousFormFilter: this.currentFilteredFormData?this.currentFilteredFormData:null,
        tnxCurrency: this.tnxCurrency
      },
    };
    this.fccOverlayService.open(overlayConfig);
  }

  onSelectSort(event, value) {
    const reqParams = {
      value:value,
      data:this.dataSource.data
    };
    this.sortEvent.emit(reqParams);
    this.sortOverlayPanel.render = false;

      // if (!fieldName) {
      //   return;
      // }
      // pass sort details in paginatorParams as sortField: "" and sortOrder as 1 or -1
      // const sortState: MatSortable = {
      //   id: fieldName,
      //   start: 'desc',
      //   disableClear: true
      // };
      // this.sort.sort(sortState);
    }

    onSelectEvent(rowData) {
      this.previewService.accordionListBoxSelection = true;
      this.selectedRowIndex = rowData.row_index;
      this.selectEvent.emit(rowData);
    }

    applyAdvancedFilter(params) {
      this.eventsFilterParams.emit(params);
    }

    closeFilterPopup() {
      this.fccOverlayService.close();
    }



}

