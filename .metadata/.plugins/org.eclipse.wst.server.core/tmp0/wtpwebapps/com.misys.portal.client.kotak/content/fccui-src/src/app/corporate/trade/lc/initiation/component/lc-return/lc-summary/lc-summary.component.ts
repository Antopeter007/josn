import { CustomCommasInCurrenciesPipe } from './../../../pipes/custom-commas-in-currencies.pipe';
import { Component, OnInit, Input } from '@angular/core';
import { CurrencyConverterPipe } from '../../../pipes/currency-converter.pipe';

@Component({
  selector: 'app-lc-summary',
  templateUrl: './lc-summary.component.html',
  styleUrls: ['./lc-summary.component.scss']
})
export class LcSummaryComponent implements OnInit {
  @Input() data;
  summarydata: any;
  applicantEntity: string;
  lcAmount: string;
  constructor(protected customCommasInCurrenciesPipe: CustomCommasInCurrenciesPipe,
              protected currencyConverterPipe: CurrencyConverterPipe,
    ) { }

  ngOnInit() {
    //eslint : no-empty-function
  }

  ngOnChanges() {
  this.summarydata = this.data;
  if (this.summarydata.applicant.entity !== undefined && this.summarydata.applicant.entity !== '' ) {
     this.applicantEntity = 'entity';
} else if (this.summarydata.applicant.name !== undefined && this.summarydata.applicant.name !== '') {
  this.applicantEntity = 'applicant';
    }
  this.lcAmount = this.currencyConverterPipe.transform(this.summarydata.amount.amount, this.summarydata.amount.currency);

}
}
