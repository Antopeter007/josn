import { FccGlobalConstant } from '../../../../../../../common/core/fcc-global-constants';
import { RejectComments } from './../../../model/rejectComments';
import { CorporateCommonService } from './../../../../../../common/services/common.service';
import { FCCBase } from './../../../../../../../base/model/fcc-base';
import { LcReturnService } from '../../../services/lc-return.service';
import { TranslateService } from '@ngx-translate/core';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { MenuItem } from 'primeng/api/menuitem';
import { FCCFormGroup } from './../../../../../../../base/model/fcc-control.model';
import { ActivatedRoute, Router } from '@angular/router';
import { ReauthService } from './../../../../../../../common/services/reauth.service';


@Component({
  selector: 'app-lc-return',
  templateUrl: './lc-return-section.component.html',
  styleUrls: ['./lc-return-section.component.scss']
})
export class LcReturnSectionComponent extends FCCBase implements OnInit, OnDestroy {
  lcNumber: any;
  txnNumber: any;
  items: any[] = [];
  fetchItems: MenuItem[];
  activeItem: MenuItem;
  form: FCCFormGroup;
  filteredItems: MenuItem[];
  display = false;
  allLcRecords;
  LcDashboard;
  approve;
  return;
  proceed;
  rejectComment = new RejectComments();
  responseData: any;
  commentLength = FccGlobalConstant.RETURN_COMMENTS_LENGTH;
  strResult = '';
  enteredCharCount = 0;
  comments = '';
  constructor(protected translateService: TranslateService, protected lcReturnService: LcReturnService,
              protected route: ActivatedRoute, protected router: Router, protected commonService: CorporateCommonService,
              protected reauthService: ReauthService) {
    super();
  }

  ngOnInit() {
    this.LcDashboard = `${this.translateService.instant('lcdashboard')}`;
    this.approve = `${this.translateService.instant('approve')}`;
    this.return = `${this.translateService.instant('return')}`;
    this.proceed = `${this.translateService.instant('proceed_lc')}`;
    this.comments = `${this.translateService.instant('comments')}`;
    this.txnNumber = this.route.snapshot.params.id;
    this.lcNumber = this.route.snapshot.params.systemId;
    this.fetchItems = this.lcReturnService.getTanMenuList();
    for (let i = 0; i < this.fetchItems.length; i++) {
      this.translateService
        .get(this.fetchItems[i].label)
        .subscribe((res: string) => {
          this.items.push({ label: res, id: res });
        });
    }
    this.activeItem = this.items[0];
    this.getMasterRecord(this.txnNumber);
  }

  getMasterRecord(lc) {
    this.lcReturnService.getMasterTransaction(lc).subscribe(res => {
      this.allLcRecords = res;
    });
  }



  displayComponent(event) {
    // eslint-disable-next-line no-console
    console.log(event);
  }

  approveTransaction() {
    const reauthData: any = { action : FccGlobalConstant.APPROVE,
                              txnNumber: this.txnNumber,
                              allLcRecords: this.allLcRecords };
    this.reauthService.reauthenticate(reauthData, FccGlobalConstant.reAuthComponentKey);
  }

  returnTransaction() {
    this.display = true;
  }

  rejectCall(input) {
    this.display = false;
    this.rejectComment.comments = input.value;
    const reauthData: any = { action : FccGlobalConstant.RETURN,
                              txnNumber: this.txnNumber,
                              allLcRecords: this.allLcRecords,
                              rejectComment: this.rejectComment };
    this.reauthService.reauthenticate(reauthData, FccGlobalConstant.reAuthComponentKey);
  }


  goToDashboard() {
    this.router.navigate(['/dashboard']);
  }

  ngOnDestroy() {
    if (this.txnNumber) {
        this.txnNumber = '';
    }
  }

  valuechange(event) {
    this.strResult = event.srcElement.value;
    this .enteredCharCount = 0;
    if (this .strResult !== '' ) {
          this .enteredCharCount = this .strResult.length;
         }
 }
}
