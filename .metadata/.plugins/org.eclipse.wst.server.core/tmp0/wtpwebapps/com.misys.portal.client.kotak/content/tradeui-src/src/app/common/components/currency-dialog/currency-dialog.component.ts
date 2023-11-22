import { Constants } from './../../constants';
import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng';
import { Currency } from '../../model/currency.model';
import { CommonService } from '../../services/common.service';
import { StaticDataService } from '../../services/staticData.service';

@Component({
  selector: 'fcc-common-currency-dialog',
  templateUrl: './currency-dialog.component.html',
  styleUrls: ['./currency-dialog.component.scss']
})
export class CurrencyDialogComponent implements OnInit {

  currencies: Currency[];
  cols: any[];
  imagePath: string;

  constructor(public dialogRef: DynamicDialogRef, public config: DynamicDialogConfig, public staticDataService: StaticDataService,
              public translate: TranslateService, public commonService: CommonService) { }
  ngOnInit() {
    this.imagePath = this.commonService.getImagePath();
    this.staticDataService.getCurrencies().subscribe(data => {
      this.currencies = data.currencies;
      this.currencies.forEach(element => {
        element.flag = `${this.imagePath}flags/${element.isocode.substr(0, Constants.LENGTH_2).toLowerCase()}.png`;
      });
    });

    let currNameHeader: any;
    let isoHeader: any;

    this.translate.get('KEY_CURRENCY_NAME').subscribe((res: string) => {
      currNameHeader = res;
    });
    this.translate.get('KEY_ISO_CODE').subscribe((res: string) => {
      isoHeader = res;
    });
    this.cols = [
      { field: 'isocode', header: isoHeader, width: '35%' },
      { field: 'flag', header: '', width: '15%'},
      { field: 'currencyName', header: currNameHeader, width: '50%' }

    ];
  }
    onNoClick(): void {
      this.dialogRef.close();
    }

    selectCurrency(isoCode: string) {
      this.dialogRef.close(isoCode);
  }

}
