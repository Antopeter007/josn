import { Component, Input, OnInit } from '@angular/core';
import { FccGlobalConstant } from '../../core/fcc-global-constants';

@Component({
  selector: 'fcc-app-review-submit-error-table',
  templateUrl: './review-submit-error-table.component.html',
  styleUrls: ['./review-submit-error-table.component.scss']
})
export class ReviewSubmitErrorTableComponent implements OnInit {

  @Input() submitErrorMessage: any = [];
  columns = [];
  numVisible = FccGlobalConstant.LENGTH_1;
  numScroll = FccGlobalConstant.LENGTH_1;
  maxErrors = FccGlobalConstant.LENGTH_5;
  isCarouselRequired = false;
  dir: string = localStorage.getItem('langDir');

  ngOnInit(): void {
    this.columns = [
      { field: 'accountNumber', header: 'beneAccount', class: 'accountNumber' },
      { field: 'approveStatus', header: 'approveStatus', class: 'approveStatus', fieldClass: 'approvestatusField' },
      { field: 'errorCode', header: 'beneDesc', class: 'description' }
  ];
  if(this.submitErrorMessage.length > this.maxErrors){
      this.isCarouselRequired = true;
    } else {
      this.isCarouselRequired = false;
    }
  }


  addValue() {
    const size = (this.submitErrorMessage.length)/this.maxErrors;
    const carosuelData = [];
    for(let i=0; i<Math.ceil(size);i++){
      carosuelData.push(i+1);
    }
    return carosuelData;
  }

  getTableData(error: any){

    const tableData = [];
    const startIndex = (error - 1)*this.maxErrors;
    for(let i = startIndex; i< error*this.maxErrors ; i++){
      if(this.submitErrorMessage[i] !== undefined && this.submitErrorMessage[i] !== null ){
      tableData.push(this.submitErrorMessage[i]);
      }
    }
    return tableData;
  }

}
