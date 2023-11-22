import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { UtilityService } from '../../../corporate/trade/lc/initiation/services/utility.service';
import { CommonService } from '../../services/common.service';

@Component({
  selector: 'fcc-user-audit',
  templateUrl: './user-audit.component.html',
  styleUrls: ['./user-audit.component.scss']
})
export class UserAuditComponent implements OnInit, OnChanges {

  @Input() tnxId: any;
  @Input() maxRecords: any;
  @Input() displayType = 'vertical';
  @Input() auditItemsList: any;
  @Output() viewMoreEvent: EventEmitter<any> = new EventEmitter<any>();
  @Output() dataLoaded: EventEmitter<any> = new EventEmitter<any>();
  auditList: any = [];
  showAuditData = false;
  isViewMoreApplicable = false;
  dir: string = localStorage.getItem('langDir');

  constructor(protected commonService: CommonService, protected translateService: TranslateService,
              protected utilityService: UtilityService) { }

  ngOnInit() {
    //eslint : no-empty-function
  }

  ngOnChanges() {
    this.showAuditData = false;
    if (this.tnxId) {
      this.commonService.getUserAuditByTnx(this.tnxId).subscribe(resp => {
        if (resp?.body?.items) {
          if (resp.body.items.length > 0) {
            resp.body.items.forEach(ele => {
              if (!ele.time) {
                const date = this.utilityService.transformDateTimeFormat(ele.date);
                ele.date = date.slice(0, date.length - 10);
                ele.time = date.slice(date.length - 9);
              }
            });
          }
          if (this.maxRecords && resp.body.items.length > this.maxRecords) {
            this.auditList = resp.body.items.slice(0, 3);
            this.isViewMoreApplicable = true;
          } else {
            this.auditList = resp.body.items;
            this.isViewMoreApplicable = false;
          }
        }
        this.showAuditData = true;
        this.dataLoaded.emit();
      }, () => {
        this.auditList = [];
        this.showAuditData = true;
        this.dataLoaded.emit();
      });
    } else {
      this.showAuditData = true;
    }
  }

  viewMore() {
    this.viewMoreEvent.emit();
  }

}
