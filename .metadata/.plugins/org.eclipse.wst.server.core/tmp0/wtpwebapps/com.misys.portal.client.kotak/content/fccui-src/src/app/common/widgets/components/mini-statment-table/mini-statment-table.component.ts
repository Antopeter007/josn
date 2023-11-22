import { HideShowDeleteWidgetsService } from './../../../services/hide-show-delete-widgets.service';
import { TranslateService } from '@ngx-translate/core';
import { FccGlobalConstantService } from './../../../core/fcc-global-constant.service';
import { CommonService } from './../../../services/common.service';
import { DashboardService } from './../../../services/dashboard.service';
import { Component, OnInit, Input, OnChanges, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-mini-statment-table',
  templateUrl: './mini-statment-table.component.html',
  styleUrls: ['./mini-statment-table.component.scss']
})
export class MiniStatmentTableComponent implements OnChanges, OnInit {

  @Output() tableDataPresent = new EventEmitter<any>();
  @Input() accountNumber;
  @Input() selectedTransactionType: string;
  @Input() entityId: string;
  contextPath: any;
  rowCount: string;
  monthsDifference: string;
  count: string;
  fromdate: string;
  todate: string;
  accountId: string;
  list = [];
  slicedList = [];
  searchRow = [];
  hideShowCard = true;
  isPresent = true;
  creditImage;
  debitImage;
  checkCustomise;

  constructor(protected commonService: CommonService,
              protected fccGlobalConstantService: FccGlobalConstantService,
              protected translateService: TranslateService,
              protected dashboardService: DashboardService,
              protected hideShowDeleteWidgetsService: HideShowDeleteWidgetsService) {


  }

  ngOnInit() {
    this.searchRow = [
      { field: 'Date', header: `${this.translateService.instant('date')}`, id: 'dateCol', class: 'date-width' },
      { field: 'Description', header: `${this.translateService.instant('description')}`, id: 'descriptionCol', class: 'desc-width' },
      { field: 'amount', header: `${this.translateService.instant('amount')}`, id: 'amountCol', class: 'amount-width' },
    ];
    this.hideShowDeleteWidgetsService.customiseSubject.subscribe(data => {
      this.checkCustomise = data;
    });

  }

  loadConfigurationFiles() {
    this.commonService.loadDefaultConfiguration().subscribe(response => {
      if (response) {
        this.contextPath = this.fccGlobalConstantService.contextPath;
        this.rowCount = response.MiniCount.toString();
        this.monthsDifference = response.Minimonth.toString();
        this.creditImage = this.contextPath + response.ministatementCreditImage;
        this.debitImage = this.contextPath + response.ministatementDebitImage;
        this.getAccountStatment();
      }
    });
  }

  formatDate() {
    const date = new Date();
    this.todate = date.getDate() + '-' + (date.getMonth() + 1) + '-' + date.getFullYear();
    date.setMonth(date.getMonth() - +this.monthsDifference);
    this.fromdate = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
  }

  ngOnChanges() {
    if (this.accountNumber !== undefined) {
      this.accountId = this.accountNumber.id;
      this.loadConfigurationFiles();
    }
  }
  getAccountStatment() {
    this.dashboardService.getAccountStatment(this.rowCount, this.fromdate, this.todate, this.accountId,
      this.selectedTransactionType, this.entityId)
      .subscribe(data => {
        this.list = data;
        this.slicedList = this.list.slice(0, +this.rowCount);
        if (this.slicedList.length > 0) {
          this.isPresent = true;
          this.tableDataPresent.emit(this.isPresent);
        } else {
          this.isPresent = false;
          this.tableDataPresent.emit(this.isPresent);
        }
      });
  }

}
