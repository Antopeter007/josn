import {
  AfterViewInit,
  Component,
  EventEmitter,
  Output,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FCCBase } from './../../../../../base/model/fcc-base';
import {
  FCCMVFormControl,
  FCCFormGroup,
} from './../../../../../base/model/fcc-control.model';

import {
  IDataEmittterModel,
  IUpdateFccBase,
} from '../../form-control-resolver/form-control-resolver.model';
import { CommonService } from '../../../../../common/services/common.service';
import { TranslateService } from '@ngx-translate/core';
import { PaginatorParams } from './../../../../../base/model/paginator-params';
import { Table } from 'primeng/table';

@Component({
  selector: 'fcc-edit-table',
  templateUrl: './edit-table.component.html',
  styleUrls: ['./edit-table.component.scss'],
})
export class EditTableComponent
  extends FCCBase
  implements OnInit, AfterViewInit, IUpdateFccBase
{
  control: FCCMVFormControl;
  @Input() 
  set setControl(control: FCCMVFormControl) { 
    this.control = control;
    this.refreshData();
  }
  @Input() form!: FCCFormGroup;
  @Input() mode!: string;
  @Input() hostComponentData!: any | null;
  @Output() controlDataEmitter: EventEmitter<IDataEmittterModel> =
    new EventEmitter<IDataEmittterModel>();
  compData = new Map<string, any>();
  paginatorParams = PaginatorParams.paginatorParams;
  @ViewChild('tt') public ptable: Table;
  @ViewChild('et') public enrichTable: Table;

  constructor(protected commonService: CommonService,
    protected translate: TranslateService) {
    super();
  }

  dir = localStorage.getItem('langDir');
  contextPath: string;
  errorHeader = `${this.translate.instant('errorTitle')}`;
  rows = 10;

  ngOnInit(): void {
    this.commonService.loadDefaultConfiguration().subscribe(
      (response) => {
        if (response) {
          this.rows = response.rowDisplayLimit ? response.rowDisplayLimit : 10;
        }
      }
    );
    this.contextPath = this.commonService.getContextPath();
    this.paginatorParams.defaultRows = this.rows <= 10 ? 10 : (this.rows <= 20 ? 20 : (this.rows <= 50 ? 50 : 100));
    this.paginatorParams.rppOptions = [10, 20, 50, 100];
  }
  ngAfterViewInit(): void {
    if (this.control.key === 'paymentsTable') {
      this.control?.params?.data.forEach((rowData) => {
        rowData['updateFlag'] = true;
      });
    }
    this.controlDataEmitter.emit({
      control: this.control,
      data: this.compData,
    });
    if(this.commonService.isNonEmptyValue(this.enrichTable)){
      const tableContext = Object.getPrototypeOf(this.enrichTable);
      tableContext['bindDocumentEditListener'] = function() {
      if (!this.documentEditListener) {
        this.documentEditListener = (event) => {
              (typeof this.editingCellRowIndex === 'undefined') ? 
              this.editingCellClick = true : this.editingCellClick = this.editingCellClick;
              if(localStorage.getItem('iseditCell')){
                  this.editingCellClick = false;
                  localStorage.removeItem('iseditCell');
              } 
              if (this.editingCell && !this.editingCellClick && this.isEditingCellValid()) {
                  //DomHandler.removeClass(this.editingCell, 'ui-editing-cell');
                  this.editingCell.classList.remove('ui-editing-cell');
                  this.editingCell = null;
                  this.onEditComplete.emit({ field: this.editingCellField, data: this.editingCellData,
                    originalEvent: event, index: this.editingCellRowIndex });
                  this.editingCellField = null;
                  this.editingCellData = null;
                  this.editingCellRowIndex = null;
                  this.unbindDocumentEditListener();
              }
              this.editingCellClick = false;
          };
          document.addEventListener('click', this.documentEditListener);
        }
      };
    }
  }

  isTypeObject(colData) {
    if(colData && typeof colData === 'object') {
      return true;
    } else {
      return false;
    }
  }

  setDirections(value: string) {
    return this.dir === 'rtl' ? (value === 'left' ? 'paginatorright' : 'paginatorleft') :
    (value === 'left' ? 'paginatorleft' : 'paginatorright');
  }

  setCurrentPage(event: { target: { value: number; }; }) {
    this.ptable.first = ((event.target.value -1) * this.ptable.rows);
    this.ptable.firstChange.emit(this.ptable.first);
    this.ptable.onLazyLoad.emit(this.ptable.createLazyLoadMetadata());
  }

  setPageSize(data: { pageSize: number; }){
    this.ptable._rows = data.pageSize;
    this.ptable.onLazyLoad.emit(this.ptable.createLazyLoadMetadata());
  }

  refreshData() {
    this.ptable.onLazyLoad.emit(this.ptable.createLazyLoadMetadata());
    this.enrichTable.onLazyLoad.emit(this.enrichTable.createLazyLoadMetadata());
  }

  setCurrentPageForEnrichTable(event: { target: { value: number; }; }) {
    this.enrichTable.first = ((event.target.value -1) * this.enrichTable.rows);
    this.enrichTable.firstChange.emit(this.enrichTable.first);
    this.enrichTable.onLazyLoad.emit(this.enrichTable.createLazyLoadMetadata());
  }

  setPageSizeForEnrichTable(data: { pageSize: number; }){
    this.enrichTable._rows = data.pageSize;
    this.enrichTable.onLazyLoad.emit(this.enrichTable.createLazyLoadMetadata());
  }
  updateIfEnrichmentTable(column){
    if(this.control?.params?.isEnrichGrid){
      this.control?.params?.columnsOrder?.forEach(element => {
        if(element.code === column){
          column = element.column;
        }
      });
    }
    return column;
  }
}
