
import { ImportLetterOfCreditResponse } from './../../../model/importLetterOfCreditResponse';
import { TranslateService } from '@ngx-translate/core';
import { LeftSectionService } from '../../../../../../common/services/leftSection.service';
import { Component, OnInit, Input } from '@angular/core';
import { MenuItem } from 'primeng/api/menuitem';

@Component({
  selector: 'app-lc-listing',
  templateUrl: './lc-listing.component.html',
  styleUrls: ['./lc-listing.component.scss']
})
export class LcListingComponent implements OnInit {
  @Input() data;
  masterRecord = [];
  items: MenuItem[];
  storeIndexValue = 0;
  getItems;
  valueArray = [];
  stringifiedData: any;
  parsedJson: any;
  keys: string [] ;
  sampledata = [];
  sampleDataModel = [];
  sampleDetailModel = [];
  lcResponse = new ImportLetterOfCreditResponse();
  widgetSelector = [];
  evilResponseProps;

  constructor(protected leftSectionService: LeftSectionService, protected translateService: TranslateService) { }

  ngOnInit() {
    // eslint-disable-next-line no-console
    console.log(JSON.stringify(this.data));
    // update as per productcomponent sections
    // this.items = this.leftSectionService.getSectionArray(FccGlobalConstant.PRODUCT_LC);
    if (this.valueArray.indexOf('Summary') === -1) {
      this.items.splice(0 , 0, { label: `${this.translateService.instant('Summary')}`, routerLink: '', });
    }
    this.items[this.storeIndexValue].styleClass = 'default-selection';
  }

  sectionActive(index) {
    this.widgetSelector.splice(0, 1);
    this.widgetSelector.push(this.items[index].target);
    this.items[this.storeIndexValue].styleClass = '';
    this.storeIndexValue = index;
    this.items[index].styleClass = 'default-selection';
  }

  ngOnChanges() {

    this.evilResponseProps = Object.keys(this.data);
    this.lcResponse.lcDetails = this.data.lcDetails;
    this.lcResponse.lcType = this.data.lcType;
    this.lcResponse.confirmation = this.data.confirmation;

    }





}


