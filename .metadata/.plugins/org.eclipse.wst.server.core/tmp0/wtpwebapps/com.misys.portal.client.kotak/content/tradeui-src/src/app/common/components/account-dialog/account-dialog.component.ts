
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng';
import { Component, OnInit } from '@angular/core';
import { StaticDataService } from '../../services/staticData.service';
import { IUCommonDataService } from '../../../trade/iu/common/service/iuCommonData.service';
import { CommonDataService } from '../../services/common-data.service';

@Component({
  selector: 'fcc-common-account-dialog',
  templateUrl: './account-dialog.component.html',
  styleUrls: ['./account-dialog.component.scss']
})

 export class AccountDialogComponent implements OnInit {
  cols: any[];
  listOfAccount = [];
  accountNo: string;
  currencyCode: string;
  description: string;

  constructor(public staticDataService: StaticDataService, public iuCommonDataService: IUCommonDataService,
              public ref: DynamicDialogRef, public config: DynamicDialogConfig, public commonDataService: CommonDataService) {}

  ngOnInit() {
    this.getAccounts();
  }

  public getAccounts(): void {
    const entity = this.commonDataService.getEntity();
    this.staticDataService.getStaticAccounts('account', entity , this.accountNo, this.currencyCode, this.description).subscribe(data => {
      this.listOfAccount = data.items;
    });
   }
}
