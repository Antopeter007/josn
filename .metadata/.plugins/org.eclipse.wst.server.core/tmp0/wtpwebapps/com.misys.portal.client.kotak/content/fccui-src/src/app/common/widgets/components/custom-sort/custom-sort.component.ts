import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonService } from '../../../../common/services/common.service';

@Component({
  selector: 'fcc-custom-sort',
  templateUrl: './custom-sort.component.html',
  styleUrls: ['./custom-sort.component.scss']
})
export class CustomSortComponent implements OnInit {

  @Input()
  order = '';

  @Input()
  field = '';

  @Output()
  sort: EventEmitter<any> = new EventEmitter<any>();

  @Output()
  emitHideSortIcon: EventEmitter<any> = new EventEmitter<any>();
  ASC = 'asc';
  DESC = 'desc';
  UNSORTED = '';

  contextPath: string;

  constructor(protected commonService: CommonService) { }

  ngOnInit(): void {
    this.contextPath = this.commonService.getContextPath();
  }
  sortColumn(){
    if (this.order === this.UNSORTED){
      this.order = this.ASC;
    } else if (this.order === this.ASC)
    {
      this.order = this.DESC;
    } else {
      this.order = this.ASC;
    }
    const data = {
      sortField : this.field,
      sortOrder : this.order === this.ASC ? 1 : -1
    };
    this.sort.emit(data);
  }
}
