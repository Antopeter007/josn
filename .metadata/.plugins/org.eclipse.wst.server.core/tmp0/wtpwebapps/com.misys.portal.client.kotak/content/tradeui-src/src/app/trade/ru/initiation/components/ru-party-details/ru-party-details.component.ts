import { Constants } from './../../../../../common/constants';
import { PartyDetailsComponent } from './../../../../common/components/party-details/party-details.component';
import { CommonDataService } from './../../../../../common/services/common-data.service';
import { Component, OnInit, Input, ViewChild } from '@angular/core';

@Component({
  selector: 'fcc-ru-party-details',
  templateUrl: './ru-party-details.component.html',
  styleUrls: ['./ru-party-details.component.scss']
})
export class RUPartyDetailsComponent implements OnInit {

  @ViewChild(PartyDetailsComponent) partyDetailsComponent: PartyDetailsComponent;
  @Input() showEntity = true;

  @Input() public bgRecord;
  viewMode = false;

  constructor(public commonDataService: CommonDataService) {
   }
   ngOnInit() {
    if (this.commonDataService.getDisplayMode() === Constants.MODE_VIEW) {
      this.viewMode = true;
    }
   }
   generatePdf(generatePdfService) {
     if (this.partyDetailsComponent) {
      this.partyDetailsComponent.generatePdf(generatePdfService, 'beneficiary');
      this.partyDetailsComponent.generatePdf(generatePdfService, 'applicant');
     }
   }
}
