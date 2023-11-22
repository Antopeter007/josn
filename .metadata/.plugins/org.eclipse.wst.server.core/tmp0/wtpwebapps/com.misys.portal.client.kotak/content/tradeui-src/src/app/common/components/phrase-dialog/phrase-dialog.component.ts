import { CommonDataService } from './../../services/common-data.service';
import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DialogService, DynamicDialogRef, DynamicDialogConfig } from 'primeng';
import { Constants } from '../../constants';
import { Entity } from '../../model/entity.model';
import { PhrasesList } from '../../model/phrase.model';
import { CommonService } from '../../services/common.service';
import { EntityDialogComponent } from '../entity-dialog/entity-dialog.component';

@Component({
  selector: 'fcc-common-phrase-dialog',
  templateUrl: './phrase-dialog.component.html',
  styleUrls: ['./phrase-dialog.component.scss'],
  providers: [DialogService]
})
export class PhraseDialogComponent implements OnInit {

  phraseList: PhrasesList[] = [];
  tempTableData: any;
  tabledata: any[] = [];
  contextPath: string;
  entity = '*';
  abbvName: string;
  productCode: string;
  category: string;
  description: string;
  url: string;
  filterParameters: any;

  constructor(public commonService: CommonService, protected activatedRoute: ActivatedRoute,
              public ref: DynamicDialogRef, public dialogService: DialogService,
              public dynamicDialogConfig: DynamicDialogConfig, public commonDataService: CommonDataService) { }

  ngOnInit(): void {
    this.productCode = this.dynamicDialogConfig.data.product;
    this.category = this.commonService.getCategoryId(this.dynamicDialogConfig.data.categoryName);
    this.entity = this.dynamicDialogConfig.data.applicantEntityName;
    this.fetchListOfPhrases(this.entity, this.productCode, this.category, '', '');
  }

  fetchFilteredListOfPhrases() {
    this.fetchListOfPhrases(this.entity, this.productCode, this.category, this.abbvName, this.description);
  }

  fetchListOfPhrases(entity: string, productCode: string, category: string, abbvName: string, description: string) {
    const entityName = `${entity}|*`;
    const product = `${productCode}|*`;
    this.contextPath = window[Constants.CONTEXT_PATH];
    this.url = `/restportal/listdata?Name=${encodeURIComponent('core/listdef/systemfeatures/openPhrasesMO')}`;
    if (this.commonDataService.getIsBankUser()) {
      this.filterParameters = { product_code: '', phrase_type: Constants.STATIC_PHRASE, abbv_name: abbvName,
        description };
    } else {
      this.filterParameters = { entity: entityName, product_code: product, phrase_type: Constants.STATIC_PHRASE,
        category, abbv_name: abbvName, description };
    }
    const baseUrl = this.contextPath + this.url;
    const paginatorParams = { start: 0, first: 0 };
    this.commonService.getTableData(baseUrl, encodeURIComponent(JSON.stringify(this.filterParameters)),
      encodeURIComponent(JSON.stringify(paginatorParams)))
      .subscribe(result => {
        this.tempTableData = result.rowDetails;
        if (this.tempTableData) {
          this.tabledata = [];
          this.tempTableData.forEach(element => {
            const obj = {};
            element.index.forEach(ele => {
              if (ele.name === 'text') {
                obj[ele.name] = JSON.parse(ele.value);
              } else {
                obj[ele.name] = ele.value;
              }
            });
            this.tabledata.push(obj);
          });
          this.phraseList = this.tabledata;
        }
      });
  }

  concatText(textContent) {
    if (textContent.includes('\\n')) {
      textContent = textContent.split('\\n').join('');
    }
    if (textContent.length > Constants.LENGTH_100) {
      return textContent.substring(Constants.DECIMAL_0, Constants.LENGTH_101) + Constants.TRAILING_SUBSTRING_CHAR;
    } else {
      return textContent;
    }
  }
}
