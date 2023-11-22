import { Constants } from './../../../../common/constants';
import { CommonDataService } from './../../../../common/services/common-data.service';
import { IUCommonDataService } from './../../../../trade/iu/common/service/iuCommonData.service';
import { CommonService } from './../../../../common/services/common.service';
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'fcc-bank-message-details',
  templateUrl: './message-details.component.html',
  styleUrls: ['./message-details.component.scss']
})
export class MessageDetailsComponent implements OnInit {

  @Input() public tnxRecord;

  constructor(public readonly commonService: CommonService, public readonly iuCommonDataService: IUCommonDataService,
              public readonly commonDataService: CommonDataService) { }

  ngOnInit() {
  }

  generatePdf(generatePdfService) {
    generatePdfService.setSectionDetails('MESSAGE_DETAILS', true, false, 'messageDetails');
  }

}
