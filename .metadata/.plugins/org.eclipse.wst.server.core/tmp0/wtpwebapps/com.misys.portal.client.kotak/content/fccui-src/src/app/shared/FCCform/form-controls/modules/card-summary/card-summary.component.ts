import { SelectionModel } from '@angular/cdk/collections';
import {
  AfterViewInit,
  Component,
  EventEmitter, Input, OnDestroy,
  OnInit, Output, ViewChild
} from '@angular/core';
import { MatAccordion } from '@angular/material/expansion';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { TranslateService } from '@ngx-translate/core';
import { PaginatorParams } from './../../../../../base/model/paginator-params';
import { ProductStateService } from './../../../../../corporate/trade/lc/common/services/product-state.service';
import { CurrencyConverterPipe } from './../../../../../corporate/trade/lc/initiation/pipes/currency-converter.pipe';
import { PurchaseOrder } from './../../../../../corporate/trade/lc/initiation/services/purchaseOrder';
import { PurchaseOrderLineItemMap } from './../../../../../corporate/trade/lc/initiation/services/purchaseOrderLineItem';
import { CommonService } from '../../../../../common/services/common.service';
import {
  IDataEmittterModel,
  IUpdateFccBase
} from '../../form-control-resolver/form-control-resolver.model';
import { FCCBase } from './../../../../../base/model/fcc-base';
import {
  FCCFormGroup, FCCMVFormControl
} from './../../../../../base/model/fcc-control.model';

@Component({
  selector: 'fcc-card-summary',
  templateUrl: './card-summary.component.html',
  styleUrls: ['./card-summary.component.scss'],
})
export class CardSummaryComponent
  extends FCCBase
  implements OnInit, AfterViewInit, IUpdateFccBase ,OnDestroy{

  dataSource = new MatTableDataSource<any>([]);
  expandedElement: any | null;
  selection = new SelectionModel<PurchaseOrderLineItemMap>(true, []);

  isRowExpanded: boolean;
  rowData: any;
  @ViewChild(MatAccordion) accordion: MatAccordion;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  // @Input() changing: Subject<boolean>;
  control: FCCMVFormControl;
  @Input()
  set setControl(control: FCCMVFormControl) {
    this.control = control;
  }
  @Input() form!: FCCFormGroup;
  @Input() mode!: string;
  @Input() hostComponentData!: any | null;
  @Output() controlDataEmitter: EventEmitter<IDataEmittterModel> =
    new EventEmitter<IDataEmittterModel>();
  compData = new Map<string, any>();
  paginatorParams = PaginatorParams.paginatorParams;
  poSummary = [];
  remittanceInst = 'purchaseOrderremittanceInst';
  expControl: any;
  expandedPanelData: any;
  @Input()purchaseOrders: PurchaseOrder[] = [];
  currency: any;
  poNum='poNum';
  poDate='poDate';
  noOfItems='noOfItems';
  netAmount='netAmount';
  taxes='taxes';
  grossAmount='grossAmount';
  purchaseOrderNum='purchaseOrderNum';
  purchaseOrderDATE='purchaseOrderDATE';
  dateValidationError='dateValidationError';
  purchaseOrderTaxes='purchaseOrderTaxes';
  SavePurchaseButton='SavePurchaseButton';
  cancelLabel='cancelLabel';
  SaveAddNewPurchaseButton='SaveAddNewPurchaseButton';
  grossAmountLabel='grossAmount';
  poDateAndApplicationValidation='poDateAndApplicationValidation';
  poDateError:boolean=false;
  sortOptions: any[] = [{
    label: 'Oldest to Latest',
    value: 1
  }, {
    label: 'Latest to Oldest',
    value: 2
  }];
  selectedPurchaseOrderSortOrder = 2;
  constructor(protected commonService: CommonService,protected currencyConverterPipe: CurrencyConverterPipe,
    protected stateService: ProductStateService,
    protected translate: TranslateService) {
    super();
  }
  ngOnDestroy(): void {
    this.commonService.purchaseOrderAdded.next(null);
    this.commonService.purchaseOrderUpdated.next(null);
    this.commonService.purchaseOrders.next(null);

  }

  ngOnInit(): void {
    this.expControl = this.form.get(this.remittanceInst);

    if(this.purchaseOrders && this.purchaseOrders.length > 1){
      this.selectedPurchaseOrderSortOrder = this.purchaseOrders[0].POSortOrder;
    }

    this.commonService.purchaseOrders.subscribe(
      (response) => {
        this.purchaseOrders = response;
      }
    );

    this.commonService.purchaseOrderUpdated.subscribe(
      (response) => {
        if(response){
          if(this.purchaseOrders != null && this.purchaseOrders.length > 0){
            const index = this.purchaseOrders.findIndex(x => x === response);
            if (index !== -1) {
              this.purchaseOrders[index] = response;
            }
          }
        }
      }
    );

    this.commonService.purchaseOrderAdded.subscribe(
      (response) => {
        this.expandedPanelData = response;

        // this.purchaseOrders.forEach(val => {
        //   if(val !== response){
        //     val.newlyPurchaseOrder = false;
        //   }
        // });
      }
    );
    this.currency = this.form.get('poCurrency').value;
      
  }

  ngAfterViewInit(): void {
    this.expControl = this.form.get(this.remittanceInst);
  }

  setExpandedPanelData(data: any) {
    this.commonService.purchaseOrderUpdated.next(data);
    this.expandedPanelData = data;
    this.checkPurchaseOrderDate(data);
  }

  getNetAmount(purchaseOrderObj) {
    let netAmount = 0;
    purchaseOrderObj.PurchaseOrderLineItems.forEach(val => {
      if (val) {
        netAmount = netAmount + val.PurchaseOrderQuantityValue * val.PurchaseOrderQuantityPriceUnit;
      }
    });
    return this.currency + ' ' + this.currencyConverterPipe.transform(netAmount.toString(), this.currency);
  }

  isExpanded(){
    if(this.form.get('purchaseOrderToggle').value=== 'N') {
      return false;
    }
    else{
      return true;
    }
  }

  getTaxes(purchaseOrderObj) {
    let taxes = 0;
    if (purchaseOrderObj.PurchaseOrderTaxes) {
      taxes = purchaseOrderObj.PurchaseOrderTaxes;
    }
    return this.currency + ' ' + taxes;
  }
  getGrossAmount(purchaseOrderObj) {
    let netAmount = 0;
    purchaseOrderObj.PurchaseOrderLineItems.forEach(val => {
      if (val) {
        netAmount = netAmount + val.PurchaseOrderQuantityValue * val.PurchaseOrderQuantityPriceUnit;
      }
    });
    let grossAmount = netAmount;
    if(purchaseOrderObj.PurchaseOrderTaxes){
     grossAmount=grossAmount+ Number(purchaseOrderObj.PurchaseOrderTaxes);
     grossAmount=this.currencyConverterPipe.transform(grossAmount.toString(), this.currency);
  
    }
    return this.currency + ' ' + this.currencyConverterPipe.transform(grossAmount.toString(), this.currency);
  }

  change(purchaseOrderObj) {
    purchaseOrderObj.newlyPurchaseOrder = false;
    this.expandedPanelData = null;
  }
  isFormValid(purchaseOrder){

    if(purchaseOrder.PurchaseOrderID &&purchaseOrder.PurchaseOrderDate&&!purchaseOrder.taxesErrorMessage){
      return false;
    }return true;

  }

  checkPurchaseOrderDate(purchaseOrder){
    if(new Date(purchaseOrder.PurchaseOrderDate) > new Date()){
      this.poDateError=true;
    }
    else{
      this.poDateError=false;
    }
  }

  purchaseOrderDateChange(event){
    if(event.value>new Date()){
      this.poDateError=true;
    }
    else{
      this.poDateError=false;
    }
  }

  sortPurchaseOrders(event, purchaseOrders, option){
    if(option === 1){
      purchaseOrders.sort(
        (objA, objB) => objA.PurchaseOrderCreatedDate.getTime() - objB.PurchaseOrderCreatedDate.getTime(),
      );
    }else if(option === 2){
      purchaseOrders.sort(
        (objA, objB) => objB.PurchaseOrderCreatedDate.getTime() - objA.PurchaseOrderCreatedDate.getTime(),
      );
    }
    if(purchaseOrders && purchaseOrders.length > 0){
      purchaseOrders[0].POSortOrder = option;
    }
    this.purchaseOrders = purchaseOrders;
  }
}
