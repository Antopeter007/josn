import { FileHandlingService } from './../../../../../common/services/file-handling.service';
import {
  AfterViewInit,
  Component,
  EventEmitter,
  Output,
  Input,
  OnInit,
  ViewChild
} from '@angular/core';
import { FCCBase } from './../../../../../base/model/fcc-base';
import {
  FCCMVFormControl,
  FCCFormGroup,
} from './../../../../../base/model/fcc-control.model';
import { TableService } from './../../../../../base/services/table.service';
import {
  IDataEmittterModel,
  IUpdateFccBase,
} from '../../form-control-resolver/form-control-resolver.model';
import { CommonService } from '../../../../../common/services/common.service';
import { TranslateService } from '@ngx-translate/core';
import { FccGlobalConstant } from './../../../../../common/core/fcc-global-constants';
import { PaginatorParams } from './../../../../../base/model/paginator-params';
import { Table } from 'primeng';
import { ActivatedRoute } from '@angular/router';
import { PreviewService } from '../../../../../corporate/trade/lc/initiation/services/preview.service';

@Component({
  selector: 'fcc-accordion.w-full',
  templateUrl: './accordion.component.html',
  styleUrls: ['./accordion.component.scss'],
})
export class AccordionComponent
  extends FCCBase
  implements OnInit, AfterViewInit, IUpdateFccBase
{
  @Input() control!: FCCMVFormControl;
  @Input() form!: FCCFormGroup;
  @Input() mode!: string;
  @Input() hostComponentData!: any | null;
  @ViewChild('tt') public ptable: Table;
  @ViewChild('et') public enrichTable: Table;
  @Output() controlDataEmitter: EventEmitter<IDataEmittterModel> =
    new EventEmitter<IDataEmittterModel>();
  compData = new Map<string, any>();
  actionList: any[] = [];
  allowedDocViewerType: string[];
  paginatorParams = PaginatorParams.paginatorParams;
  childTnxObj : any;
  childRefID : any;
  childtnxId : any;
  childProdStatCode : any;
  childProdCode : any;
  subProductCode : any;
  childTnxTypeCode : any;
  tnxId = '';
  childStatus : any;
  childStatusBackground : any;
  tollTipDesc : any;
  operation;
  eventTnxStatCode: any;
  eventSubTnxTypeCode: any;
  parentTnxObj : any;
  parentProdCode : any;
  parentRefID : any;
  parentTnxTypeCode : any;
  tooltipTitle: any;
  statusTitle: any;
  refIdLabel: any;
  viewDetails: any;
  isMasterAccordionExpanded:boolean = false;

  constructor(protected tableService: TableService,
    protected commonService: CommonService,
    protected translate: TranslateService,
    protected fileHandlingService: FileHandlingService,
    protected activatedRoute: ActivatedRoute,
    protected previewService:PreviewService) {
    super();
  }
  contextPath: string;
  rows = 10;

  ngOnInit(): void {
    this.commonService.loadDefaultConfiguration().subscribe(
      (response) => {
        if (response) {
          this.rows = response.rowDisplayLimit ? response.rowDisplayLimit : 10;
          this.allowedDocViewerType = response.docViewerMimeType;
        }
      }
    );
    const operation = 'operation';
    const eventTnxStatCode = 'eventTnxStatCode';
    const eventSubTnxTypeCode = 'subTnxTypeCode';
    const subProductCode = 'subProductCode';
    this.activatedRoute.queryParams.subscribe(params => {
      this.operation = params[operation];
      this.eventTnxStatCode = params[eventTnxStatCode];
      this.eventSubTnxTypeCode = params[eventSubTnxTypeCode];
      this.subProductCode = params[subProductCode];
    });
    this.mode = this.commonService.getQueryParametersFromKey(FccGlobalConstant.MODE);
    this.contextPath = this.commonService.getContextPath();
    this.paginatorParams.defaultRows = this.rows <= 10 ? 10 : (this.rows <= 20 ? 20 : (this.rows <= 50 ? 50 : 100));
    this.paginatorParams.rppOptions = [10, 20, 50, 100];
    this.commonService.getChildTnxInformation().subscribe(
      (childTnx: string) => {
        this.childTnxObj = childTnx;
      }
    );
    if (this.childTnxObj) {
      this.childRefID = this.childTnxObj[FccGlobalConstant.CHANNELREF];
      this.childtnxId = this.childTnxObj[FccGlobalConstant.INST_TNX_ID];
      this.childProdStatCode = this.childTnxObj[FccGlobalConstant.prodStatCode] == null ? '' :
      this.childTnxObj[FccGlobalConstant.prodStatCode];
      this.childProdCode = this.childTnxObj[FccGlobalConstant.PRODUCTCODE];
      this.subProductCode = this.childTnxObj[FccGlobalConstant.subProductCode] == null ? '' :
      this.childTnxObj[FccGlobalConstant.subProductCode];
      this.childTnxTypeCode = this.childTnxObj[FccGlobalConstant.TNXTYPECODE] == null ? '' :
      this.childTnxObj[FccGlobalConstant.TNXTYPECODE];
    } else {
      this.commonService.getChildReferenceAsObservable().subscribe(
        (childRef: string) => {
          this.childRefID = childRef;
        }
      );
    }
    this.commonService.getParentTnxInformation().subscribe(
      (parentTnx: string) => {
        this.parentTnxObj = parentTnx;
      }
    );
    if (this.parentTnxObj) {
      this.parentProdCode = this.parentTnxObj[FccGlobalConstant.PRODUCTCODE];
      this.parentRefID = this.parentTnxObj[FccGlobalConstant.CHANNELREF];
      this.subProductCode = this.parentTnxObj[FccGlobalConstant.subProductCode] == null ? '' :
      this.parentTnxObj[FccGlobalConstant.subProductCode];
      this.parentTnxTypeCode = this.parentTnxObj[FccGlobalConstant.TNXTYPECODE] == null ? '' :
      this.parentTnxObj[FccGlobalConstant.TNXTYPECODE];
    } else {
      this.commonService.getParentReferenceAsObservable().subscribe(
        (parentRef: string) => {
          this.parentRefID = parentRef;
        }
      );
    }
    this.tollTipDesc = FccGlobalConstant.PRODUCT_CHANNELREF;
    if (this.commonService.isnonEMptyString(this.childProdCode) && this.childProdCode === FccGlobalConstant.PRODUCT_TF) {
      this.tooltipTitle = FccGlobalConstant.VIEW_FINANCE_DETAILS ;
    } else if(this.commonService.isnonEMptyString(this.parentProdCode) && (this.parentProdCode === FccGlobalConstant.PRODUCT_EC ||
      this.parentProdCode === FccGlobalConstant.PRODUCT_EL)) {
        this.tooltipTitle = FccGlobalConstant.VIEW_PARENT_TRASASACTION_DETAILS ;
    }
    this.statusTitle = FccGlobalConstant.STATUS_TITLE;
    if(this.commonService.isnonEMptyString(this.childRefID)) {
      this.refIdLabel = this.childRefID;
    } else if (this.commonService.isnonEMptyString(this.parentRefID)) {
      this.refIdLabel = this.parentRefID;
    }
    this.viewDetails = FccGlobalConstant.VIEW_DETAILS;
    this.setStatusBackground();
    this.commonService.highlightError.subscribe((response) => {
      if (response !== null) {
        if (response.sectionName === FccGlobalConstant.FT_TPT_GENERAL_DETAILS) {
          this.form.controls.tptGeneralDetails[FccGlobalConstant.PARAMS].options[0].data[0].panelValue[5].invalidValue = true;
          this.form.updateValueAndValidity();
          this.commonService.highlightError.next(null);
        } else {
          this.form.controls.tptGeneralDetails[FccGlobalConstant.PARAMS].options[0].data[1].panelValue[0].invalidValue = true;
          this.form.updateValueAndValidity();
          this.commonService.highlightError.next(null);
        }
      }
    });
  }

  setStatusBackground() {
    if (this.childProdStatCode == FccGlobalConstant.N005_NEW || this.childProdStatCode == FccGlobalConstant.N005_AMENDED ||
       this.childProdStatCode == FccGlobalConstant.N005_PART_SETTLED || this.childProdStatCode == FccGlobalConstant.N005_SETTLED) {
      this.childStatusBackground = FccGlobalConstant.GREEN;
    } else if (this.childProdStatCode == FccGlobalConstant.N005_FINANCE_OFFER) {
        this.childStatusBackground = FccGlobalConstant.BLUE;
    } else if (this.childProdStatCode == FccGlobalConstant.N005_BOOK_OFF || this.childProdStatCode == FccGlobalConstant.N005_CLOSED ||
       this.childProdStatCode == FccGlobalConstant.N005_EXPIRED) {
      this.childStatusBackground = FccGlobalConstant.AMBER;
    } else if (this.childProdStatCode == FccGlobalConstant.N005_REJECTED) {
      this.childStatusBackground = FccGlobalConstant.RED;
    }
    this.childStatus = 'N005_' + this.childProdStatCode;
  }

  onClickViewDetails() {
    if(this.commonService.isnonEMptyString(this.childRefID)) {
      if (this.childProdStatCode == FccGlobalConstant.N005_REJECTED) {
      this.commonService.openChildTransactionInquiryScreen(this.childProdCode, this.childRefID, this.subProductCode,
        this.childtnxId, this.childTnxTypeCode );
      } else {
        this.commonService.openChildTransactionInquiryScreen(this.childProdCode, this.childRefID, this.subProductCode,
          "", this.childTnxTypeCode );
      }
    } else if (this.commonService.isnonEMptyString(this.parentRefID)) {
      this.commonService.openChildTransactionInquiryScreen(this.parentProdCode, this.parentRefID, this.subProductCode,
        this.tnxId, this.parentTnxTypeCode );
    }
  }

  ngAfterViewInit(): void {
    this.previewService.setCollapsibleMasterAccordion(this.control);
    this.previewService.accordionhostComponentData = this.hostComponentData;
    this.controlDataEmitter.emit({
      control: this.control,
      data: this.compData,
    });
  }

  setControlExpandValue(isExpand){
      this.isMasterAccordionExpanded = isExpand === true ? true : false;
      this.previewService.setControlExpandValue(isExpand,this.hostComponentData); 
  }

  onClickView(){
    this.tableService.onClickView(null, this.hostComponentData.taskService.getTnxResponseObj());
  }

  isTypeObject(colData) {
    if(colData && typeof colData === 'object') {
      return true;
    } else {
      return false;
    }
  }

  getMenus(event, key, index, rowData) {
    Array.from(document.getElementsByClassName('ellipisis')).forEach((element, arrayIndex)=>{
      if (index=== arrayIndex){
        document.getElementsByClassName('ellipisis')[index].classList.add('overdraw');
      } else if (document.getElementsByClassName('ellipisis')[arrayIndex].classList.contains('overdraw')) {
        document.getElementsByClassName('ellipisis')[arrayIndex].classList.remove('overdraw');
      }
    });
    this.actionList = [];
    this.actionList.push({
      label: this.translate.instant(FccGlobalConstant.VIEW_ADDITIONAL_INFO),
      command: () => this.onClickEye(event, key, index, rowData)
    });
  }

  keyPressRouteDots(event) {
    this.actionList.forEach(element => {
      if (element.label === event.target.innerText) {
        element.command();
      }
    });
  }

  setDirections(value: string) {
    return this.dir === 'rtl' ? (value === 'left' ? 'paginatorright' : 'paginatorleft') :
    (value === 'left' ? 'paginatorleft' : 'paginatorright');
  }

  setCurrentPage(event: { target: { value: number; }; }) {
    this.ptable.first = ((event.target.value -1) * this.ptable.rows);
    this.ptable.firstChange.emit(this.ptable.first);
    this.ptable.onLazyLoad.emit(this.ptable.createLazyLoadMetadata());
  }

  setPageSize(data: { pageSize: number; }){
    this.ptable._rows = data.pageSize;
    this.ptable.onLazyLoad.emit(this.ptable.createLazyLoadMetadata());
  }

  setCurrentPageForEnrichTable(event: { target: { value: number; }; }) {
    this.enrichTable.first = ((event.target.value -1) * this.enrichTable.rows);
    this.enrichTable.firstChange.emit(this.enrichTable.first);
    this.enrichTable.onLazyLoad.emit(this.enrichTable.createLazyLoadMetadata());
  }

  setPageSizeForEnrichTable(data: { pageSize: number; }){
    this.enrichTable._rows = data.pageSize;
    this.enrichTable.onLazyLoad.emit(this.enrichTable.createLazyLoadMetadata());
  }

  onClickViewFile(docId, fileName) {
    this.fileHandlingService.viewFile(docId, fileName);
  }
}
