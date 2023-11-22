import { Component, OnInit } from '@angular/core';
import { FccGlobalConstant } from '../../../../common/core/fcc-global-constants';
import { CommonService } from '../../../../common/services/common.service';
import { SummaryService } from '../../../../common/services/summary.service';
@Component({
  selector: 'app-summary',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.scss']
})
export class SummaryComponent implements OnInit {

  summaryDetails: any = [];
  summaryLayout: any;
  constructor(protected summaryService: SummaryService,
              protected commonServie: CommonService) { }

  ngOnInit(): void {
    const data: any = [];
    Object.keys(this.commonServie.getSummaryDetails()).forEach((item) => {
      data.push({
          [item]: this.commonServie.getSummaryDetails()[item]
      });
    });
    this.summaryService.getSummaryLayout(FccGlobalConstant.DEPOSIT_WIDGET_SUMMARY).then((res) => {
      this.summaryLayout = res;
      if (data && data.length) {
        data.forEach((item) => {
          if (res.columns.indexOf(Object.keys(item)[0]) > -1) {
            this.summaryDetails.push(item);
          }
        });
      }
    });
  }
}
