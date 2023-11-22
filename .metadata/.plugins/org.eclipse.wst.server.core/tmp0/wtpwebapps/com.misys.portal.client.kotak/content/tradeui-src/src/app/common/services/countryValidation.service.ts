import { Constants } from '../constants';
import { validateCountryCode } from '../validators/common-validator';
import { StaticDataService } from './staticData.service';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CountryValidationService {

  public countries;

  constructor(public staticDataService: StaticDataService) { }

  validateCountry(value) {
    let tempCountries;
    if (this.countries === undefined || this.countries === null || this.countries.length === 0) {
      this.countries = [];
      this.staticDataService.getCountries(Constants.COUNTRY_CODE_VALUE).subscribe(data => {
      tempCountries = data.items as string[];
      this.countries = tempCountries;
      value.setValidators([validateCountryCode(this.countries)]);
      value.updateValueAndValidity();
    });
    } else {
      value.setValidators([validateCountryCode(this.countries)]);
      value.updateValueAndValidity();
    }
  }

}
