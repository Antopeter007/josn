import { animate, state, style, transition, trigger } from '@angular/animations';
import { SelectionModel } from '@angular/cdk/collections';
import {
  AfterViewInit,
  Component,
  EventEmitter, Input, OnChanges, OnDestroy,
  OnInit, Output, ViewChild
} from '@angular/core';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { TranslateService } from '@ngx-translate/core';
import { FccGlobalConstant } from '../../../../../common/core/fcc-global-constants';
import { CommonService } from '../../../../../common/services/common.service';
import {
  IDataEmittterModel,
  IUpdateFccBase
} from '../../form-control-resolver/form-control-resolver.model';
import { FCCBase } from './../../../../../base/model/fcc-base';
import {
  FCCFormGroup
} from './../../../../../base/model/fcc-control.model';
import { PaginatorParams } from './../../../../../base/model/paginator-params';
import { PurchaseOrder } from './../../../../../corporate/trade/lc/initiation/services/purchaseOrder';
import { PurchaseOrderLineItemMap } from './../../../../../corporate/trade/lc/initiation/services/purchaseOrderLineItem';

@Component({
  selector: 'fcc-expansion-panel-edit-form-table',
  templateUrl: './expansion-panel-edit-form-table.component.html',
  styleUrls: ['./expansion-panel-edit-form-table.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class ExpansionPanelEditFormTableComponent
  extends FCCBase
  implements OnInit, AfterViewInit, OnChanges, OnDestroy, IUpdateFccBase {

  dataSource = new MatTableDataSource<any>([]);
  expandedElement: any | null;
  selection = new SelectionModel<PurchaseOrderLineItemMap>(true, []);

  isRowExpanded: boolean;
  rowData: any;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @Input() control: any;
  @Input() purchaseOrder: PurchaseOrder;
  @Input() purchaseOrders: PurchaseOrder[];
  @Input() form!: FCCFormGroup;
  @Input() mode!: string;
  @Input() hostComponentData!: any | null;
  @Output() controlDataEmitter: EventEmitter<IDataEmittterModel> =
    new EventEmitter<IDataEmittterModel>();
  compData = new Map<string, any>();
  paginatorParams = PaginatorParams.paginatorParams;
  sortOptions: any[] = [{
    label: 'Oldest to Latest',
    value: 1
  }, {
    label: 'Latest to Oldest',
    value: 2
  }];
  options: any[] = [];
  filteredOptions: any[] = [];
  selectedPurchaseOrderLineItemSortOrder = 2;

  constructor(protected commonService: CommonService,paginator: MatPaginatorIntl,
    protected translate: TranslateService) {
      super();
      paginator.itemsPerPageLabel = this.translate.instant('rows_per_table');
  }

  dir = localStorage.getItem('langDir');
  contextPath: string;
  errorHeader = `${this.translate.instant('errorTitle')}`;
  rows = 10;
  sortOperation = false;

  ngOnInit(): void {
    if(this.form){
      this.options = this.form.get('purchaseOrderremittanceInst')[FccGlobalConstant.PARAMS][FccGlobalConstant.OPTIONS];
      this.filteredOptions = this.options;
      if(this.purchaseOrder && this.purchaseOrder.PurchaseOrderLineItems && this.purchaseOrder.PurchaseOrderLineItems.length > 1){
        this.selectedPurchaseOrderLineItemSortOrder = this.purchaseOrder.PurchaseOrderLineItems[0].PurchaseOrderLineItemSortOrder;
      }
    }

    this.commonService.loadDefaultConfiguration().subscribe(
      (response) => {
        if (response) {
          this.rows = response.rowDisplayLimit ? response.rowDisplayLimit : 10;
        }
      }
    );

    this.commonService.purchaseOrderLineItemGridExpandedElementData.subscribe(
      (response) => {
        if (response) {
          this.expandedElement = response[0];
        }else{
          this.expandedElement = response;
        }
      }
    );

    this.commonService.purchaseOrderLineItemGridSelectedData.subscribe(
      (response) => {
        if (response==null) {
          // let index = this.purchaseOrders.findIndex(x => x === response[1]);
          // if (index !== -1) {
          this.selection.clear();
          // }

        }
      }
    );

    this.commonService.purchaseOrderUpdateIndex.subscribe(
      (response) => {
        if (response !== -1) {
          // this.dataSource = new MatTableDataSource<any>(this.purchaseOrders[response].PurchaseOrderLineItems);
        }
      }
    );

    this.commonService.purchaseOrderUpdated.subscribe(
      (response) => {
        if (response) {
          this.dataSource = new MatTableDataSource<PurchaseOrderLineItemMap>(response.PurchaseOrderLineItems);
          this.dataSource.paginator = this.paginator;
        }
      }
    );

    this.commonService.purchaseOrderLineItemGridUpdateSelectedData.subscribe(
      (response) => {
        if (response) {
          this.toggleAllRows();
        }
      }
    );

    this.contextPath = this.commonService.getContextPath();
    this.paginatorParams.defaultRows = this.rows <= 10 ? 10 : (this.rows <= 20 ? 20 : (this.rows <= 50 ? 50 : 100));
    this.paginatorParams.rppOptions = [10, 20, 50, 100];
    this.dataSource = new MatTableDataSource<any>(this.purchaseOrder.PurchaseOrderLineItems);
    this.dataSource.paginator = this.paginator;

  }

  applyFilter(evt: string) {
    evt = evt + "";
    if (!evt){
      this.filteredOptions = this.options;
    } else {
      evt = evt.toLowerCase();
      this.filteredOptions = this.options.filter(item => (item.label + "") === evt || item.label.toLowerCase().indexOf(evt) >= 0);
    }
  }

  resetOptions(){
    this.filteredOptions = this.options;
    this.sortOperation = false;
  }

  public valueMapper = (key) => {
    const selection = this.options.find(x => x.value == key);
    if (selection && selection != undefined) {
      return selection.label;
    }
  };

  ngOnChanges(): void {
    this.dataSource = new MatTableDataSource<any>(this.purchaseOrder.PurchaseOrderLineItems);
    this.dataSource.paginator = this.paginator;

  }

  ngAfterViewInit(): void {
    this.controlDataEmitter.emit({
      control: this.control,
      data: this.compData,
    });
    this.dataSource.paginator = this.paginator;
  }

  ngOnDestroy(): void {
    this.commonService.purchaseOrderLineItemGridExpandedElementData.next(null);
    this.commonService.purchaseOrderLineItemGridUpdateSelectedData.next(null);
    this.commonService.purchaseOrderUpdateIndex.next(null);
  }

  isTypeObject(colData) {
    if (colData && typeof colData === 'object') {
      return true;
    } else {
      return false;
    }
  }


  setDirections(value: string) {
    return this.dir === 'rtl' ? (value === 'left' ? 'paginatorright' : 'paginatorleft') :
      (value === 'left' ? 'paginatorleft' : 'paginatorright');
  }

  rowExpand(data) {
    this.isRowExpanded = !this.isRowExpanded;
    this.rowData = data;
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  toggleAllRows() {
    if (this.isAllSelected()) {
      this.selection.clear();
      this.commonService.purchaseOrderLineItemGridSelectedData.next(this.selection.selected);
      return;
    }

    this.selection.select(...this.dataSource.data);
    if (this.dataSource.data.length === 0) {
      this.selection.clear();
    }
    this.commonService.purchaseOrderLineItemGridSelectedData.next(this.selection.selected);
  }

  selectHandler() {
    this.commonService.purchaseOrderLineItemGridSelectedData.next(this.selection.selected);
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: PurchaseOrderLineItemMap): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.PurchaseOrderQuantityValue + 1}`;
  }

  sortRecords(event, purchaseOrder, option){
    this.sortOperation = true;
    this.expandedElement = null;
    if(option === 1){
      purchaseOrder.PurchaseOrderLineItems.sort(
        (objA, objB) => objA.PurchaseOrderLineItemCreatedDate.getTime() - objB.PurchaseOrderLineItemCreatedDate.getTime(),
      );
    }else if(option === 2){
      purchaseOrder.PurchaseOrderLineItems.sort(
        (objA, objB) => objB.PurchaseOrderLineItemCreatedDate.getTime() - objA.PurchaseOrderLineItemCreatedDate.getTime(),
      );
    }
    purchaseOrder.POSortOrder = option;
    this.dataSource = new MatTableDataSource<PurchaseOrderLineItemMap>(purchaseOrder.PurchaseOrderLineItems);
    // this.dataSource.
    this.expandedElement = null;
  }

  enableOperations(){
    this.sortOperation = false;
  }
  
}
