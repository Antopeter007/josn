import { ChangeDetectorRef, Component, EventEmitter, Input, Output } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FccGlobalConstant } from '../../core/fcc-global-constants';
import { ResolverService } from '../../services/resolver.service';

@Component({
  selector: 'fcc-review-detail-table',
  templateUrl: './review-detail-table.component.html',
  styleUrls: ['./review-detail-table.component.scss']
})
export class ReviewDetailTableComponent {
  @Input() generalDetails?: any;
  @Input() inputParams: any;
  @Input() componentTitle?: any;
  @Input() tableName?: any;
  changed: boolean;
  selectedRowsdata: any[] = [];
  disableReturn = false;
  @Output() rowSelectEventListdef: EventEmitter<any> = new EventEmitter<any>();
  @Output() rowUnSelectEventListdef: EventEmitter<any> = new EventEmitter<any>();
  constructor(protected changedetector: ChangeDetectorRef,
    protected activatedRoute: ActivatedRoute,
    protected resolverService: ResolverService) { }

  ngOnInit() {
    this.changed = false;
    this.changedetector.detectChanges();
    this.changed = true;
  }

  onHeaderCheckboxToggle(event) {
    this.selectedRowsdata = [];
    if (event.checked) {
      event.selectedRows.forEach(element => {
        this.selectedRowsdata.push(element);
      });
    }
    this.resolverService.selectedRowsdata = this.selectedRowsdata;
  }

  refreshTableData(){
    this.selectedRowsdata = [];
    this.resolverService.selectedRowsdata = [];
  }

  getRowUnSelectEvent(event) {
    this.activatedRoute.queryParams.subscribe(params => {
      if ((params.option === FccGlobalConstant.PAYMENTS)
        && params.category === FccGlobalConstant.FCM.toUpperCase()) {
        this.selectedRowsdata = event.selectedRowsData;
      } else {
        this.rowUnSelectEventListdef.emit(event);
        if (event.type === 'checkbox') {
          this.disableReturn = false;
          this.selectedRowsdata.forEach((item, index) => {
            if (item === event.data.box_ref || JSON.stringify(item) === JSON.stringify(event.data)) {
              this.selectedRowsdata.splice(index, 1);
            }
          });
        }
      }
    });
    this.resolverService.selectedRowsdata = this.selectedRowsdata;
  }
  getRowSelectEvent(event) {
    this.activatedRoute.queryParams.subscribe(params => {
      if ((params.option === FccGlobalConstant.PAYMENTS)
        && params.category === FccGlobalConstant.FCM.toUpperCase()) {
        this.selectedRowsdata = event.selectedRowsData;
        this.rowSelectEventListdef.emit(event);
      } else {
        this.rowSelectEventListdef.emit(event);
        if (event.type === 'checkbox' && event.data.box_ref) {
          this.selectedRowsdata.push(event.data.box_ref);
        } else if (event.type === 'checkbox') {
          this.selectedRowsdata.push(event.data);
        }
      }
    });
    this.resolverService.selectedRowsdata = this.selectedRowsdata;
  }

  getFilterChipResetEvent(event: any){
    const control = event?.controlName;
    if(control){
      delete(this.inputParams.retainFilterValues[control]);
      this.changed = true;
    }
  }
}
