import { Injectable } from '@angular/core';
import { CanDeactivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { Observable, Subject } from 'rxjs';
import { HideShowDeleteWidgetsService } from './../../../app/common/services/hide-show-delete-widgets.service';
import { ConfirmationGuardDialogComponent } from './../../../app/confirmation-guard-dialog/confirmation-guard-dialog.component';
import { TranslateService } from '@ngx-translate/core';
import { MatDialog } from '@angular/material/dialog';
import { Overlay } from '@angular/cdk/overlay';
import { FCCFormControl } from './../../../app/base/model/fcc-control.model';
import { TabPanelService } from './../../../app/common/services/tab-panel.service';
import { ProductStateService } from './../../../app/corporate/trade/lc/common/services/product-state.service';
import { FccGlobalConstant } from './../../../app/common/core/fcc-global-constants';
import { CommonService } from './../../../app/common/services/common.service';
export interface CanComponentDeactivate {
  confirm(): boolean;
}

@Injectable({
  providedIn: 'root'
})
export class ConfirmationGuard implements CanDeactivate<CanComponentDeactivate> {
  private subject = new Subject<any>();
  mode: string;
  option: string;
  tabSectionControlMap: Map<string, Map<string, FCCFormControl>>;
  sectionNames: string[];
  public steps: any[] = [];
  displayConfirmationDialog: boolean;
  constructor(
    // eslint-disable-next-line @typescript-eslint/no-parameter-properties
    protected hideShowDeleteWidgetsService: HideShowDeleteWidgetsService, private location: Location,
    protected translateService: TranslateService, protected dialog: MatDialog,
    protected overlay: Overlay, protected route: ActivatedRoute, protected tabPanelService: TabPanelService,
    protected stateService: ProductStateService, protected dialogRefKey: MatDialog, protected commonService: CommonService
    ) {}
  canDeactivate(
    component: CanComponentDeactivate,
    currentRoute: ActivatedRouteSnapshot,
    currentState: RouterStateSnapshot,
    nextState?: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      let dialogRef;
      this.commonService.loadDefaultConfiguration().subscribe(response => {
        if (response) {
          this.displayConfirmationDialog = response.displayConfirmationDialog;
        }
      });
      if (this.displayConfirmationDialog === false) {
        return true;
      }
      if((this.commonService.tnxResponse === undefined && this.commonService.isEmptyValue(this.commonService.referenceId) &&
      this.commonService.isEmptyValue(this.commonService.currentStateTnxResponse)) || (this.commonService.tnxResponse !== 
      undefined && (this.commonService.isEmptyValue(this.commonService.referenceId) &&
      this.commonService.isEmptyValue(this.commonService.tnxResponse)))){
          return true;
      }
      this.route.queryParams.subscribe(params => {
        this.mode = params.mode;
        this.option = params.option;
      });
      if (this.option === FccGlobalConstant.TEMPLATE || this.option === FccGlobalConstant.OPTION_TRANSFER 
        || this.option === FccGlobalConstant.OPTION_ASSIGNEE || this.option === FccGlobalConstant.ACTION_REQUIRED 
        ||(this.mode !== FccGlobalConstant.DRAFT_OPTION && 
          (this.mode === FccGlobalConstant.INITIATE && !this.commonService.referenceId)) ||
        nextState.url.substring(1, 7) === FccGlobalConstant.SUBMIT || nextState.url.substring(1, 7) === FccGlobalConstant.LOGOUT) {
        return true;
      }
      const forceLogoutVal = sessionStorage.getItem('isForceLogout');
      if(forceLogoutVal === 'true' && FccGlobalConstant.SESSION_INVALID_LANDING_PAGES.includes(nextState.url)){
        return true;
      }
      if ( this.dialog.openDialogs.length === 0 ) {
        dialogRef = this.dialog.open(ConfirmationGuardDialogComponent, {
        panelClass: 'confirmDialogClass',
        scrollStrategy: this.overlay.scrollStrategies.noop(),
        height: 'auto',
        width: '600px',
        autoFocus: false,
        disableClose: false,
        hasBackdrop: true,
        data: { }
       });
        dialogRef.afterClosed().subscribe(result => {
          if(this.commonService.dialogReload === FccGlobalConstant.STAY_HERE){
            this.location.go(currentState.url);
            }
          if(this.commonService.dialogReload !== FccGlobalConstant.STAY_HERE){
            if(!(result && result.ref_id))
            {
              this.subject.next(result);
            }
            else 
            {
             this.commonService.onCloseDeleteSubScription = this.commonService.onCloseDeleteSubject.subscribe(response => {
             if(response && this.commonService.oncloseDeleteRedirect)
             {
              this.commonService.oncloseDeleteRedirect = false;
              this.commonService.isComingFromDiscard = true;
              this.subject.next(true);
             }
            });
            }
          }
          this.commonService.dialogReload = "";
        });
      }
      return this.subject;
   }
 }
