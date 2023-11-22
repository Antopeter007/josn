import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FccGlobalConstant } from './../../../common/core/fcc-global-constants';

@Component({
  selector: 'fcc-custom-paginator',
  templateUrl: './custom-paginator.component.html',
  styleUrls: ['./custom-paginator.component.scss']
})
export class CustomPaginatorComponent implements OnInit {

 
  @Input('state')
  set setState(state){
    if(state !== undefined){
      this.state = state;
      this.currentPage = Math.floor((this.state.first / this.state.rows))+1;
      this.state.first = ((this.currentPage -1) * this.state.rows);
      this.showPagination = true;
    }
  }
  @Input()
  paginatorParams;
  @Output()
  setPageSizeCallback: EventEmitter<any> = new EventEmitter<any>();
  @Output()
  setCurrentPageCallback: EventEmitter<any> = new EventEmitter<any>();

  showPagination : boolean = false;
  showError : boolean = false;
  state : any;
  currentPage : number;
  langDir: string = localStorage.getItem('langDir');
  numberPattern : RegExp = new RegExp("[0-9]");

  constructor() { }

  ngOnInit(): void {
  }

  setPageSize(pageSize){
    const data = {pageSize : pageSize, currentPage : this.currentPage};
    this.setPageSizeCallback.emit(data);
  }

  setCurrentPage(page,state){
    if(page.target.value > state.pageCount || page.target.value == "" || page.target.value == 0) {
      this.showError = true;
      this.currentPage = Math.floor((this.state.first / this.state.rows))+1;
      setTimeout(() => {
        this.showError = false;
      }, FccGlobalConstant.LENGTH_5000);
    } else {
      this.showError = false;
      if (page && page.target && page.target.value && Number(page.target.value) !== this.currentPage){
        this.setCurrentPageCallback.emit(page);
      }
    }
  }

  numberOnly(event) {
    const inp = String.fromCharCode(event.keyCode);
    if (this.numberPattern.test(inp)) {
      return true;
    } else {
      event.preventDefault();
      return false;
    }
  }

  numberOnlyAndSetPage(event, state) {
    const inp = event.target.value;
    if (this.numberPattern.test(inp)) {
      this.setCurrentPage(event, state)
    }
  }

}
