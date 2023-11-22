import { Constants } from './../../constants';
import { CommonDataService } from '../../../common/services/common-data.service';
import { Component, OnInit, Input, ViewChild, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { CommonService } from '../../services/common.service';
import { ConfirmationService } from 'primeng/api';
import { DialogService } from 'primeng';
import { ChargeService } from '../../services/charge.service';
import { UntypedFormGroup, UntypedFormBuilder } from '@angular/forms';
import { Charge } from '../../model/charge.model';
import { TradeCommonDataService } from '../../../trade/common/services/trade-common-data.service';
import { AddChargesDialogComponent } from '../../../bank/common/components/add-charges-dialog/add-charges-dialog.component';

interface ChargesList {
  chargeType: string;
  description: string;
  ccy: string;
  amount: string;
  status: string;
  settlementDate: string;
  eqvAmt: string;
  eqvCcy: string;
  chrgId: string;
  objectData?: object;
 }

@Component({
  selector: 'fcc-common-inquiry-consolidated-charges',
  templateUrl: './inquiry-consolidated-charges.component.html',
  styleUrls: ['./inquiry-consolidated-charges.component.scss']
})

export class InquiryConsolidatedChargesComponent implements OnInit {
  chargeForm: UntypedFormGroup;
  refId: string;
  tnxId: string;
  prodCode: string;
  chargesList: ChargesList[] = [];
  @Input() viewMode = true;
  charges: Charge[] = [];
  imagePath: string;
  @Input() public bgRecord;
  public unsignedMode = false;
  @Output() formReady = new EventEmitter<UntypedFormGroup>();
  chargeId = 0;

  @ViewChild(AddChargesDialogComponent) chargesDialogComponent: AddChargesDialogComponent;

  constructor(protected activatedRoute: ActivatedRoute, public translate: TranslateService, public commonData: CommonDataService,
              protected commonService: CommonService, public tradeCommonDataService: TradeCommonDataService,
              public dialogService: DialogService, protected chargeService: ChargeService, protected fb: UntypedFormBuilder,
              protected confirmationService: ConfirmationService) { }

  ngOnInit() {
    this.activatedRoute.params.subscribe(paramsId => {
      this.refId = paramsId.refId;
      this.tnxId = paramsId.tnxId;
      this.prodCode = paramsId.productcode;
     });
    if (this.viewMode) {
      this.prodCode = (this.prodCode !== undefined && this.prodCode) ? this.prodCode : this.refId.substring(0, Constants.LENGTH_2);
      this.commonService.getChargeDetails(this.refId, this.tnxId, this.prodCode, 'tnx').subscribe(data => {
        this.chargesList = data.chargeAttachments;
        this.chargesList.forEach(charge => {
          charge.ccy = this.setAmtForCharges(charge.ccy, charge.eqvCcy);
          charge.amount = this.setAmtForCharges(charge.amount, charge.eqvAmt);
        });
      });
    } else {
      this.imagePath = this.commonService.getImagePath();
      this.chargeForm = this.fb.group({
        listOfCharges: ['']
      });
      if (this.bgRecord.charges && this.bgRecord.charges !== '') {
        for (const index of this.bgRecord.charges.charge) {
          const charge = new Charge();
          charge.chargeId = index.chrg_id.toString();
          charge.chrgCode = index.chrgCode;
          charge.additionalComment = index.additionalComment;
          charge.curCode = this.setAmtForCharges(index.ccy, index.eqvCcy);
          charge.amt = this.setAmtForCharges(index.amount, index.eqvAmt);
          charge.status = index.status;
          charge.settlementDate = index.settlementDate;
          this.chargeService.addCharges(charge);
        }
        this.charges = this.chargeService.getCharges();
        this.chargeForm.get('listOfCharges').setValue(this.chargeService.getCharges());
      }
      // Emit the form group to the parent
      this.formReady.emit(this.chargeForm);
    }
  }

  addCharges() {
    this.chargeId++;
    const ref = this.dialogService.open(AddChargesDialogComponent, {
      header: this.commonService.getTranslation('HEADER_CHARGE_DETAILS'),
      width: '60vw',
      height: '82vh',
      contentStyle: {overflow: 'auto', height: '82vh'},
      data : {charge: '', chargeId: this.chargeId, curCode: this.bgRecord.bgCurCode}
      });
    ref.onClose.subscribe(() => {
        this.charges = this.chargeService.getCharges();
        this.chargeForm.get('listOfCharges').setValue(this.chargeService.getCharges());
    });
  }

  deleteCharge(charge) {
    const message = this.commonService.getTranslation('DELETE_CONFIRMATION_MSG');
    const dialogHeader = this.commonService.getTranslation('DAILOG_CONFIRMATION');
    this.confirmationService.confirm({
        message,
        header: dialogHeader,
        icon: 'pi pi-exclamation-triangle',
        key: 'chargeDeleteConfirmDialog',
        acceptLabel: this.commonService.getTranslation('USER_ACTION_OK'),
        rejectLabel: 'Cancel',
        accept: () => {
          for (let i = 0; i < this.chargeService.chargeList.length; ++i) {
            if (this.chargeService.chargeList[i].chargeId === charge.chargeId) {
                this.chargeService.chargeList.splice(i, 1);
            }
          }
          this.charges = this.chargeService.getCharges();
          this.chargeForm.get('listOfCharges').setValue(this.chargeService.getCharges());
        },
        reject: () => {

        }
    });
  }

  editCharge(charge) {
    const ref = this.dialogService.open(AddChargesDialogComponent, {
      header: this.commonService.getTranslation('HEADER_CHARGE_DETAILS'),
      width: '60vw',
      height: '82vh',
      contentStyle: {overflow: 'auto', height: '82vh'},
      data : {charge}
      });
    ref.onClose.subscribe(() => {
        this.charges = this.chargeService.getCharges();
        this.chargeForm.get('listOfCharges').setValue(this.chargeService.getCharges());
    });
  }

  setAmtForCharges(amount: any, eqvAmount: any) {
    if (this.commonService.isNonEmptyString(eqvAmount)){
      amount = eqvAmount;
    }
    return amount;
  }

  setCCYForCharges(ccy: any, eqvCcy: any) {
    if (this.commonService.isNonEmptyString(eqvCcy)){
      ccy = eqvCcy;
    }
    return ccy;
  }
}
