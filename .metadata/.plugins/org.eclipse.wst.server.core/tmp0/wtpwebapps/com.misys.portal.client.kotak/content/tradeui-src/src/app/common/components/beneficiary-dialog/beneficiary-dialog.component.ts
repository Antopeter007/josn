import { Constants } from './../../constants';
import { Component, OnInit, Output, EventEmitter, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { Message, DynamicDialogRef, DynamicDialogConfig, DialogService } from 'primeng';
import { TranslateService } from '@ngx-translate/core';

import { AddCounterpartyBankDialogComponent } from '../add-counterparty-bank-dialog/add-counterparty-bank-dialog.component';
import { StaticDataService } from '../../services/staticData.service';
import { IUCommonDataService } from '../../../trade/iu/common/service/iuCommonData.service';
import { CommonService } from '../../services/common.service';

interface Beneficiaries {
  abbvname: string;
  name: string;
  addressLine1: string;
  addressLine2: string;
  dom: string;
  country: string;
  entity: string;
  bei: string;
}
@Component({
  selector: 'fcc-common-beneficiary-dialog',
  templateUrl: './beneficiary-dialog.component.html',
  styleUrls: ['./beneficiary-dialog.component.scss'],
  providers: [DialogService]
})
export class BeneficiaryDialogComponent implements OnInit {
  listOfBeneficiaries: Beneficiaries[] = [];
  name: string;
  abbvName: string;
  msgs: Message[] = [];
  displayAddBeneficaryDialog = false;
  modalDialogTitle: string;
  modalBeneficiariesListDialogTitle: string;
  typeOfDialog: string;
  displayMsgs = false;
  cols: any[];
  filteredListOfBeneficiaries: Beneficiaries[] = [];

  @Output() displayAddBeneficaryDialogChange = new EventEmitter();

  constructor(public staticDataService: StaticDataService, public translate: TranslateService,
              public iUCommonDataService: IUCommonDataService, public ref: DynamicDialogRef,
              public dialogService: DialogService, public config: DynamicDialogConfig,
              public commonService: CommonService) { }

  ngOnInit() {

    this.getBeneficiaries();
  }

  public getBeneficiaries(): void {
    this.staticDataService.getBeneficiary(this.abbvName, this.name).subscribe(data => {
      this.listOfBeneficiaries = data.beneficiaryAccounts;
      this.filteredListOfBeneficiaries = this.listOfBeneficiaries;
     });

  }
  public getFilteredListOfBeneficiaries(): void {
    this.filteredListOfBeneficiaries = this.listOfBeneficiaries.filter(d => (!this.abbvName && !this.name) ||
                                        (this.abbvName === d.abbvname && !this.name) ||
                                        (!this.abbvName && this.name === d.name) ||
                                        (this.abbvName === d.abbvname && this.name === d.name));
  }
  public openAddCounterPartyDialog(): void {
    this.translate.get('TABLE_SUMMARY_COUNTERPARTIES_LIST').subscribe((res: string) => {
      this.modalDialogTitle =  res;
    });
    this.displayMsgs = true;
    const ref = this.dialogService.open(AddCounterpartyBankDialogComponent, {
      data: {
        id: this.config.data.id
      },
        header: this.modalDialogTitle,
        width: '65vw',
        height: '55vh',
        contentStyle: {overflow: 'auto', height: '55vh'}
      });
    ref.onClose.subscribe((responseMessage: string) => {
        if (responseMessage) {
          this.msgs = [{severity: 'info', summary: responseMessage.substring(Constants.LENGTH_3)}];
          this.displayMsgs = true;
          this.staticDataService.getBeneficiary(this.abbvName, this.name).subscribe(data => {
            this.listOfBeneficiaries = data.beneficiaryAccounts;
            this.filteredListOfBeneficiaries = this.listOfBeneficiaries;
           });
        }
      });
  }
}
