import { Constants } from './../../constants';
import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { DialogService, DynamicDialogRef, DynamicDialogConfig, Message } from 'primeng';
import { TranslateService } from '@ngx-translate/core';
import { Bank } from '../../model/bank.model';

import { AddCounterpartyBankDialogComponent } from '../add-counterparty-bank-dialog/add-counterparty-bank-dialog.component';
import { StaticDataService } from '../../services/staticData.service';
import { IUCommonDataService } from '../../../trade/iu/common/service/iuCommonData.service';

@Component({
  selector: 'fcc-common-bank-dialog',
  templateUrl: './bank-dialog.component.html',
  styleUrls: ['./bank-dialog.component.scss'],
  providers: [DialogService]
})
export class BankDialogComponent implements OnInit {

  name: string = null;
  abbvName: string = null;
  listOfBanks: Bank[] = [];
  filteredListOfBank: Bank[] = [];
  headerBankListDialog: string;
  msgs: Message[] = [];
  displayAddBankDialog = false;
  modalDialogTitle: string;
  modalTitle: string;
  typeOfDialog: string;
  displayMsgs = false;
  cols: any[];
  @Output() displayAddBankDialogChange = new EventEmitter();

  constructor(public staticDataService: StaticDataService, public translate: TranslateService,
              public iUCommonDataService: IUCommonDataService, public ref: DynamicDialogRef,
              public dialogService: DialogService, public config: DynamicDialogConfig) { }

  ngOnInit() {

    this.getBanks();
  }

  public getBanks(): void {
    this.staticDataService.getBanks().subscribe(data => {
      this.listOfBanks = data.items;
      this.filteredListOfBank = this.listOfBanks;
     });
  }

  public getFilteredListOfBank(): void {
    this.filteredListOfBank = this.listOfBanks.filter(d => (!this.abbvName && !this.name) ||
                                        (this.abbvName === d.ABBVNAME && !this.name) ||
                                        (!this.abbvName && this.name === d.NAME) ||
                                        (this.abbvName === d.ABBVNAME && this.name === d.NAME));
  }

  public openAddBankDialog(): void {
    this.translate.get('TABLE_SUMMARY_BANKS_LIST').subscribe((res: string) => {
      this.modalDialogTitle =  res;
    });
    this.displayMsgs = true;
    const ref = this.dialogService.open(AddCounterpartyBankDialogComponent, {
      data: {
        id: this.config.data.id
      },
        header: this.modalDialogTitle,
        width: '65vw',
        height: '77vh',
        contentStyle: {overflow: 'auto', height: '77vh'}
      });
    ref.onClose.subscribe((responseMessage: string) => {
        if (responseMessage) {
          this.msgs = [{severity: 'info', summary: responseMessage.substring(Constants.LENGTH_3)}];
          this.displayMsgs = true;
          this.getBanks();
        }
      });
  }
}
