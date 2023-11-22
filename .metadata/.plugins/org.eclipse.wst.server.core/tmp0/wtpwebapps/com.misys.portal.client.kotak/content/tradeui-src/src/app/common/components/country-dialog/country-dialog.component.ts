import { Country } from './../../model/country.model';
import { Component, OnInit } from '@angular/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng';
import { IUCommonDataService } from '../../../trade/iu/common/service/iuCommonData.service';
import { CommonService } from '../../services/common.service';
import { StaticDataService } from '../../services/staticData.service';
import { Constants } from '../../constants';

@Component({
  selector: 'fcc-common-country-dialog',
  templateUrl: './country-dialog.component.html',
  styleUrls: ['./country-dialog.component.scss']
})
export class CountryDialogComponent implements OnInit {

  listOfCountries: Country[] = [];
  imagePath: string;
  isoLabel: string;
  countryLabel: string;
  productCode: string;
  cols: any[];
  constructor(public staticDataService: StaticDataService, public commonService: CommonService,
              public iUCommonDataService: IUCommonDataService,
              public ref: DynamicDialogRef, public config: DynamicDialogConfig) { }

  ngOnInit() {
    this.cols = [
      { field: 'VALUE', header: 'ISOCODE', width: '35%' },
      { field: 'FLAG', header: '', width: '15%' },
      { field: 'DESCRIPTION', header: 'COUNTRY', width: '50%' }
    ];

    this.imagePath = this.commonService.getImagePath();
    this.staticDataService.getCountries(Constants.COUNTRY_CODE_VALUE).subscribe(data => {
      this.listOfCountries = data.items;
      this.listOfCountries.forEach(element => {
        element.FLAG = `${this.imagePath}flags/${element.VALUE.toLowerCase()}.png`;
      });
     });
  }

}
