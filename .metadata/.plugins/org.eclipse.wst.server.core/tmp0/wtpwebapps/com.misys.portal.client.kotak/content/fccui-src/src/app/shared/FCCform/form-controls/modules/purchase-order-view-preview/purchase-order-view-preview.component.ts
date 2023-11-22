import {
  Component,
  EventEmitter, Input, OnInit, Output, ViewChild
} from '@angular/core';
import { MatAccordion } from '@angular/material/expansion';
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
  FCCFormGroup, FCCMVFormControl
} from './../../../../../base/model/fcc-control.model';
import { ProductStateService } from './../../../../../corporate/trade/lc/common/services/product-state.service';
import { CurrencyConverterPipe } from './../../../../../corporate/trade/lc/initiation/pipes/currency-converter.pipe';
import { PurchaseOrderLineItemMap } from './../../../../../corporate/trade/lc/initiation/services/purchaseOrderLineItem';

@Component({
  selector: 'fcc-purchase-order-view-preview',
  templateUrl: './purchase-order-view-preview.component.html',
  styleUrls: ['./purchase-order-view-preview.component.scss']
})
export class PurchaseOrderViewPreviewComponent extends FCCBase
  implements OnInit, IUpdateFccBase {

  @ViewChild(MatAccordion) accordion: MatAccordion;
  control: FCCMVFormControl;
  @Input()
  set setControl(control: FCCMVFormControl) {
    this.control = control;
  }

  @Input() purchaseOrders: any[] = [];
  @Input() form!: FCCFormGroup;
  @Input() mode!: string;
  @Input() productCode: string;

  @Output() controlDataEmitter: EventEmitter<IDataEmittterModel> =
    new EventEmitter<IDataEmittterModel>();

  constructor(protected currencyConverterPipe: CurrencyConverterPipe,
    protected translateService: TranslateService,
    protected stateService: ProductStateService,
    protected commonService: CommonService) {
    super();
  }
  currency: any;
  poNum = 'poNum';
  poDate = 'poDate';
  noOfItems = 'noOfItems';
  currencyLabel = 'currency';
  netAmount = 'netAmount';
  taxes = 'taxes';
  grossAmount = 'grossAmount';
  purchaseOrderNum = 'purchaseOrderNum';
  purchaseOrderDATE = 'purchaseOrderDATE';
  dateValidationError = 'dateValidationError';
  purchaseOrderTaxes = 'purchaseOrderTaxes';
  SavePurchaseButton = 'SavePurchaseButton';
  SaveAddNewPurchaseButton = 'SaveAddNewPurchaseButton';
  grossAmountLabel = 'grossAmount';
  expandedPanelData: any;
  dataSource = new MatTableDataSource<PurchaseOrderLineItemMap>([]);
  tableColumns: any[] = [];
  displayedColumns: any[] = [];

  ngOnInit(): void {
    this.getColumns();
    this.getColumnsHeaders();
    if (this.purchaseOrders && this.purchaseOrders !== undefined && this.purchaseOrders.length > 0) {
      this.expandedPanelData = this.purchaseOrders[0];
    }
    if (this.productCode === FccGlobalConstant.PRODUCT_LC) {
      this.currency = this.stateService.getSectionData('amountChargeDetails').get('currency').value.shortName;
    } else if (this.productCode === FccGlobalConstant.PRODUCT_SI) {
      this.currency = this.stateService.getSectionData('siAmountChargeDetails').get('currency').value.shortName;
    }
  }

  getDataSource(purchaseOrder) {
    if (purchaseOrder.PurchaseOrderLineItems !== undefined && purchaseOrder.PurchaseOrderLineItems.length > 0) {
      purchaseOrder.PurchaseOrderLineItems.forEach(val => {
        this.formatTableHeaderValues(val);
      });
    }
    return new MatTableDataSource<PurchaseOrderLineItemMap>(purchaseOrder.PurchaseOrderLineItems);
  }

  formatTableHeaderValues(product: any) {
    const PurchaseOrderQuantityPriceUnit = Number(product[FccGlobalConstant.PURCHASE_ORDER_QUANTITY_PRICE_UNIT].replace(/[^0-9.-]+/g,""));
    const PurchaseOrderQuantityValue = Number(product[FccGlobalConstant.PURCHASE_ORDER_QUANTITY_VALUE].replace(/[^0-9.-]+/g,""));
    if (product[FccGlobalConstant.PURCHASE_ORDER_QUANTITY_VALUE] > 0 && product[FccGlobalConstant.PURCHASE_ORDER_QUANTITY_PRICE_UNIT]) {
      if(!Number.isNaN(PurchaseOrderQuantityPriceUnit) && !Number.isNaN(PurchaseOrderQuantityValue)){
        const PurchaseOrderAmount = PurchaseOrderQuantityPriceUnit * PurchaseOrderQuantityValue;
        product.PurchaseOrderAmount = this.currency + ' ' 
      + this.currencyConverterPipe.transform(PurchaseOrderAmount.toString(), this.currency);
      }else{
        product.PurchaseOrderAmount = this.currency + ' ';
      }
    }

    if (PurchaseOrderQuantityValue > 0) {
      let quantityTolerancePos = '';
      if(product[FccGlobalConstant.PURCHASE_ORDER_QUANTITY_TOLERANCE_POS] !== undefined){
        quantityTolerancePos = product[FccGlobalConstant.PURCHASE_ORDER_QUANTITY_TOLERANCE_POS];
      }
      let quantityToleranceNeg = '';
      if(product[FccGlobalConstant.PURCHASE_ORDER_QUANTITY_TOLERANCE_NEG] !== undefined){
        quantityToleranceNeg = product[FccGlobalConstant.PURCHASE_ORDER_QUANTITY_TOLERANCE_NEG];
      }
      product.PurchaseOrderQuantityWithValAndTolerance = PurchaseOrderQuantityValue
        + " (+" + quantityTolerancePos + ") (-"
        + quantityToleranceNeg + ") %";
    }

    if (PurchaseOrderQuantityPriceUnit > 0) {
      let quantityPriceTolerancePos = '';
      if(product[FccGlobalConstant.PURCHASE_ORDER_PRICE_UNIT_POS] !== undefined){
        quantityPriceTolerancePos = product[FccGlobalConstant.PURCHASE_ORDER_PRICE_UNIT_POS];
      }
      let quantityPriceToleranceNeg = '';
      if(product[FccGlobalConstant.PURCHASE_ORDER_QUANTITY_PRICE_UNIT_Neg] !== undefined){
        quantityPriceToleranceNeg = product[FccGlobalConstant.PURCHASE_ORDER_QUANTITY_PRICE_UNIT_Neg];
      }

      product.PurchaseOrderPriceUnitWithValAndTolerance = this.currency + " " 
        + this.currencyConverterPipe.transform(PurchaseOrderQuantityPriceUnit.toString(), this.currency)
        + " (+" + quantityPriceTolerancePos + ") (-" +
        quantityPriceToleranceNeg + ") %";
    }
  }

  getColumns() {
    this.tableColumns = [
      {
        field: 'PurchaseOrderDescription',
        header: `${this.translateService.instant('PurchaseOrderDescription')}`,
        width: '30%'
      },
      {
        field: 'PurchaseOrderQuantityCode',
        header: `${this.translateService.instant('PurchaseOrderQuantityCode')}`,
        width: '15%'
      },
      {
        field: 'PurchaseOrderQuantityWithValAndTolerance',
        header: `${this.translateService.instant('PurchaseOrderQuantityWithValAndTolerance')}`,
        width: '20%'
      },
      {
        field: 'PurchaseOrderPriceUnitWithValAndTolerance',
        header: `${this.translateService.instant('PurchaseOrderPriceUnitWithValAndTolerance')}`,
        width: '20%'
      },
      {
        field: 'PurchaseOrderAmount',
        header: `${this.translateService.instant('PurchaseOrderAmount')}`,
        width: '15%'
      }
    ];
  }

  getColumnsHeaders() {
    this.tableColumns.forEach(col => {
      this.displayedColumns.push(col.field);
    });
  }

  getTaxes(purchaseOrderObj) {
    let taxes = 0;
    if (purchaseOrderObj.PurchaseOrderTaxes) {
      taxes = purchaseOrderObj.PurchaseOrderTaxes;
    }
    return this.currencyConverterPipe.transform(taxes.toString(), this.currency);
  }

  getGrossAmount(purchaseOrderObj) {
    let netAmount = 0;
    purchaseOrderObj.PurchaseOrderLineItems.forEach(val => {
      if (val) {
        netAmount = netAmount + Number(val.PurchaseOrderQuantityValue.replace(/[^0-9.-]+/g,"")) *
        Number(val.PurchaseOrderQuantityPriceUnit.replace(/[^0-9.-]+/g,""));
      }
    });
    let grossAmount = netAmount;
    if (purchaseOrderObj.PurchaseOrderTaxes) {
      grossAmount = grossAmount + Number(purchaseOrderObj.PurchaseOrderTaxes);
      grossAmount = this.currencyConverterPipe.transform(grossAmount.toString(), this.currency);

    }
    return this.currencyConverterPipe.transform(grossAmount.toString(), this.currency);
  }

  getNetAmount(purchaseOrderObj) {
    let netAmount = 0;
    purchaseOrderObj.PurchaseOrderLineItems.forEach(val => {
      if (val) {
        netAmount = netAmount + Number(val.PurchaseOrderQuantityValue.replace(/[^0-9.-]+/g,"")) *
        Number(val.PurchaseOrderQuantityPriceUnit.replace(/[^0-9.-]+/g,""));
      }
    });
    return this.currencyConverterPipe.transform(netAmount.toString(), this.currency);
  }

  setExpandedPanelData(data: any) {
    this.expandedPanelData = data;
  }

}
