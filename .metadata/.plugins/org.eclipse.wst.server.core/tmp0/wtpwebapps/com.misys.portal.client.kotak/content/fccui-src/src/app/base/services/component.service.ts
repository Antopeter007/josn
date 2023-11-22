
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ComponentService {
  constructor() {}

  // Table Component
  columns: any;
  values: any;
  paginator: any;
  rows: any;
  responsive: any;
  datakey: any;
  rowexpansion: boolean;
  exportcsv: any;
  filterplaceholder: any;
  globalsearch: any;
  globalsort: any;
  selectMode: any;
  exportlabel: any;
  tableName: any;
  selectionColumns: any;
  multiSelectColumnLabel: any;
  lazy: boolean;
  loading: boolean;
  totalRecords: number;
  sortOrder: number;
  sortfield: string;
  columnActions: boolean;
  expandRowCols: any;
  rowExpandMode: string;
  columnSort: any;
  fileName: string;
  rppOptions: any;
  passbackParameters: any;
  exportType: string;
  exportData: any;
  exportCols: any;
  passBackEnabled: boolean;
  selectionEnabled: boolean;
  downloadIconEnabled: boolean;
  colFilterIconEnabled: boolean;
  enhancedUXTable: boolean;
  wildsearch: boolean;
  actionconfig: boolean;
  selectedRows: any;
  checkBoxPermission: boolean;
  widgetFilter: boolean;
  displayDashboard: boolean;
  showButton: boolean;
  selectedRow: any;
  listDataDownloadWidgetDetails: any;
  alignPagination: any;
  displayInputSwitch: any;
  allowColumnCustomization: any;
  frozenColMaxLimit: any;
  filterChipsRequired: boolean;
  isActionIconsRequired: boolean;
  enableFilterPopup: boolean;
}
