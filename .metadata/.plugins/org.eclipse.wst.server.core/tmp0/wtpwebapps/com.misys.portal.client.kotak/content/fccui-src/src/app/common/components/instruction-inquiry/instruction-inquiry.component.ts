import { Component, EventEmitter, OnInit, Output, ViewChild, ElementRef, HostListener } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { MessageService } from 'primeng';
import { Subscription } from 'rxjs/internal/Subscription';
import { FCCFormGroup } from '../../../base/model/fcc-control.model';
import { FccGlobalConstant } from '../../core/fcc-global-constants';
import { CommonService } from '../../services/common.service';
import { DropDownAPIService } from '../../services/dropdownAPI.service';
import { MultiBankService } from '../../services/multi-bank.service';
import { TransactionDetailService } from '../../services/transactionDetail.service';
import { ListDefService } from '../../services/listdef.service';
import { Router } from '@angular/router';
import { ProductStateService } from '../../../corporate/trade/lc/common/services/product-state.service';
import { PdfGeneratorService } from '../../services/pdf-generator.service';
import { FormAccordionPanelService } from '../../services/form-accordion-panel.service';
import { TabPanelService } from '../../services/tab-panel.service';
import { UtilityService } from '../../../corporate/trade/lc/initiation/services/utility.service';

@Component({
  selector: 'app-instruction-inquiry',
  templateUrl: './instruction-inquiry.component.html',
  styleUrls: ['./instruction-inquiry.component.scss']
})
export class InstructionInquiryComponent implements OnInit {

  showSpinner = true;
  setEntityForm: UntypedFormGroup;
  productCode: string;
  dir: string = localStorage.getItem('langDir');
  form: FCCFormGroup;
  responseObj: any;
  entities = [];
  options = [];
  applyFilter: boolean;
  flag = false;
  pdfData: Map<string, FCCFormGroup>;
  modelJson: any;
  filterParams;
  paginatorParams;
  subSectionModels: any;
  subProductCode: string;
  refId: any;
  facilityName: string;
  toastPosition: string;
  fields = [];
  sectionNames: string[];
  @Output() closeSetEntityOverlay: EventEmitter<any> = new EventEmitter<any>();
  hasError = false;
  errorMsg: string;
  subscription: Subscription;
  componentData: any;
  model: any;
  xmlName;
  readonly param = 'params';
  readonly grouphead = 'grouphead';
  readonly previewScreen = 'previewScreen';
  menuToggleFlag: string;
  dropdownOpen = false;

  constructor(
    protected formBuilder: UntypedFormBuilder,
    protected translate: TranslateService,
    protected commonService: CommonService,
    protected transactionDetailService: TransactionDetailService,
    protected multiBankService: MultiBankService,
    protected dropdownAPIService: DropDownAPIService,
    protected messageService: MessageService,
    protected listService: ListDefService,
    protected router: Router,
    protected stateService: ProductStateService,
    protected pdfGeneratorService: PdfGeneratorService,
    protected utilityService: UtilityService,
    protected tabPanelService: TabPanelService, protected formAccordionPanelService: FormAccordionPanelService
  ) { }

  @ViewChild('inquiryID', { static: true }) public myDiv: ElementRef;
  ngOnInit(): void {
    this.commonService.getMenuValue().subscribe((value) => {
      this.menuToggleFlag = value;
    });
    this.applyFilter = false;
    this.toastPosition = this.dir === 'rtl' ? 'top-left' : 'top-right';
    this.componentData = this.commonService.getComponentRowData();
    this.productCode = this.translate.instant(this.componentData.productCode);
    this.facilityName = this.translate.instant(this.componentData.facilityName);
    this.setEntityForm = this.formBuilder.group({
      eventDropdown: [''],
      bankRef : '',
      channelRef : ''
    });
    this.xmlName = 'loan/listdef/customer/LN/inquiryDocumentInstructionTransactions';
    this.paginatorParams = {};
    const filterValues = {};
    const facilityName = 'bo_facility_name';
    filterValues[facilityName] = this.facilityName;
    this.filterParams = filterValues;
    this.getEntityList();
    this.onLoad();
    this.myDiv.nativeElement.focus();
  }

  onCloseMatDrawer(event) {
    this.closeSetEntityOverlay.emit(event);
  }

 // 01,01:97,03,13:16,01:B1
 getEntityList() {
  this.entities = [{ label: this.translate.instant(FccGlobalConstant.INSTRUCTION_INC_DD),
    value: {
      code: FccGlobalConstant.INSTRUCTION_01_40,
      label: this.translate.instant(FccGlobalConstant.INSTRUCTION_INC_DD)
    } },
    { label: this.translate.instant(FccGlobalConstant.INSTRUCTION_01_97),
    value: {
      code: FccGlobalConstant.INSTRUCTION_01_97,
      label: this.translate.instant(FccGlobalConstant.INSTRUCTION_01_97)
    } },
    { label: this.translate.instant(FccGlobalConstant.INSTRUCTION_INC_IDD),
    value: {
      code: FccGlobalConstant.INSTRUCTION_03,
      label: this.translate.instant(FccGlobalConstant.INSTRUCTION_INC_IDD)
    } },
    { label: this.translate.instant(FccGlobalConstant.INSTRUCTION_13_16),
    value: {
      code: FccGlobalConstant.INSTRUCTION_13_16,
      label: this.translate.instant(FccGlobalConstant.INSTRUCTION_13_16)
    } },
    { label: this.translate.instant(FccGlobalConstant.INSTRUCTION_01_B1),
    value: {
      code: FccGlobalConstant.INSTRUCTION_01_B1,
      label: this.translate.instant(FccGlobalConstant.INSTRUCTION_01_B1)
    } }];
  this.options = this.entities;
 }

  onClick()
  {
    this.applyFilter = !this.applyFilter;
  }
  onClickView(fields) {
    const url = this.router.serializeUrl(
        this.router.createUrlTree(['view'], { queryParams: { tnxid: fields.tnx_id, referenceid: fields.ref_id,
          productCode: fields.product_code, tnxTypeCode: fields.tnx_type_code, subProductCode: fields.sub_product_code,
          eventTnxStatCode: '01', mode: FccGlobalConstant.VIEW_MODE,
          subTnxTypeCode: fields.sub_tnx_type_code,
          operation: FccGlobalConstant.PREVIEW } })
      );
    const popup = window.open('#' + url, '_blank', 'top=100,left=200,height=400,width=900,toolbar=no,resizable=no');
    const productId = `${this.translate.instant('LN')}`;
    const mainTitle = `${this.translate.instant('MAIN_TITLE')}`;
    popup.onload = () => {
        popup.document.title = mainTitle + ' - ' + productId;
      };
  }

  onApply() {
    this.showSpinner = true;
    const filterValues = {};
    const borefidkey = 'ref_id';
    filterValues[borefidkey] = this.setEntityForm.value.channelRef;
    const facilityName = 'bo_facility_name';
    filterValues[facilityName] = this.facilityName;
    const bankRef = 'cust_ref_id';
    filterValues[bankRef] = this.setEntityForm.value.bankRef;
    const event = 'tnx_type_code_dropdown';
    let code = '';
    let subTnxTypeCode = '';
    let tnxTypeCode = '';
    if (this.setEntityForm.value.eventDropdown !== ''){
     code = this.setEntityForm.value.eventDropdown.code;
     filterValues[event] = this.setEntityForm.value.eventDropdown.code;
     const tnxTypeCodeArray = code.split(':');
     tnxTypeCode = tnxTypeCodeArray[0];
     if (tnxTypeCodeArray.length === 2) {
       subTnxTypeCode = tnxTypeCodeArray[1] ;
     }
    }
    const txnTypeCodeParam = 'tnx_type_code_parameter';
    const subTnxTypeCodeParam = 'sub_tnx_type_code_parameter';
    filterValues[txnTypeCodeParam] = tnxTypeCode;
    filterValues[subTnxTypeCodeParam] = subTnxTypeCode;
    this.filterParams = filterValues;
    this.onLoad();
  }
  onLoad() {
    this.listService.getTableData(this.xmlName, JSON.stringify(this.filterParams), JSON.stringify(this.paginatorParams))
        .subscribe(result => {
        this.fields = [];
        const tmpdata = result.rowDetails.map((ele) => ele.index);

        tmpdata.map( ( el ) => {
          const obj = {
            ref_id: '',
            tnx_amt: '',
            tnx_id: '',
            appl_date: '',
            sub_tnx_type_code: '',
            tnx_type_code: '',
            tnx_stat_code: '',
            full_type: '',
            cust_ref_id: '',
            product_code: '',
            cur_code: '',
            sub_product_code: '',
            full_name: ''
          };
          el.map( e => {
              const summarymasterempty = this.translate.instant('summarymasterempty');
              if ( e.name === FccGlobalConstant.subProductCode ) {
                obj[e.name] = this.translate.instant(e.value === '' || e.value === 'null' ? 'summarymasterempty' : e.value);
              }
              if ( e.name === FccGlobalConstant.CHANNELREF ) {
                obj[e.name] = this.translate.instant(e.value === '' || e.value === 'null' ? 'summarymasterempty' : e.value);
              }
              if ( e.name === FccGlobalConstant.subProductCode ) {
                obj[e.name] = this.translate.instant(e.value === '' || e.value === 'null' ? 'summarymasterempty' : e.value);
              }
              if ( e.name === FccGlobalConstant.AMOUNT ) {
                  obj.tnx_amt = this.commonService.decodeHtml(e.value === '' || e.value === 'null' ? summarymasterempty : e.value); }
              if ( e.name === FccGlobalConstant.BANKREF ) {
                obj.cust_ref_id = this.translate.instant(e.value === '' || e.value === 'null' ? 'summarymasterempty' : e.value);
                }
              if ( e.name === FccGlobalConstant.PRODUCTCODE ) {
                obj.product_code = e.value;
                }
              if ( e.name === FccGlobalConstant.INST_CURRENCY ) {
                obj.cur_code = this.translate.instant(e.value === '' || e.value === 'null' ? 'summarymasterempty' : e.value);
                }
              if ( e.name === FccGlobalConstant.DATE ) {
                obj.appl_date = this.commonService.decodeHtml(e.value === '' || e.value === 'null' ? summarymasterempty : e.value); }
              if ( e.name === FccGlobalConstant.INST_TNX_ID ) {
                obj.tnx_id = this.translate.instant(e.value === '' || e.value === 'null' ? 'summarymasterempty' : e.value); }
              if ( e.name === FccGlobalConstant.SUB_TNX_TYPE_CODE ) {
                  obj.sub_tnx_type_code = e.value; }
              if ( e.name === FccGlobalConstant.TNXTYPECODE ) {
                  obj.tnx_type_code = e.value; }
              if ( e.name === FccGlobalConstant.tnxStatusCode ) {
                obj.tnx_stat_code = e.value; }
              if ( e.name === FccGlobalConstant.Event ) {
                obj.full_type = this.commonService.decodeHtml(e.value === '' || e.value === 'null' ? summarymasterempty : e.value); }
              if ( e.name === FccGlobalConstant.FULLNAME ) {
                obj.full_name = this.translate.instant(e.value === '' || e.value === 'null' ? 'summarymasterempty' : e.value); }
            });
          this.fields.push(obj);
        });
        this.showSpinner = false;
      },
        () => {
          this.fields = [];
        });
      }

  filterSelect(event) {
    if (event) {
      this.dropdownOpen = false;
    }
  }
  onDropdownChange(event) {
    if (event) {
      this.dropdownOpen = !this.dropdownOpen;
    }
  }

  oncloseDropdown(event: KeyboardEvent) {
    if (event) {
      this.dropdownOpen = false;
    }
  }

@HostListener('document:keydown.escape', ['$event']) onKeydownHandler(event:
  KeyboardEvent) {
    if (event && !this.dropdownOpen){
      this.onCloseMatDrawer(event);
    }
}
}
