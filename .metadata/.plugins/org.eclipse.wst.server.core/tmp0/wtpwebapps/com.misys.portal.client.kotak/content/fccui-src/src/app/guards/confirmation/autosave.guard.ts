import { Overlay } from '@angular/cdk/overlay';
import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, CanDeactivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Observable, Subject } from 'rxjs';
import { FCCFormControl } from './../../../app/base/model/fcc-control.model';
import { ProductService } from './../../../app/base/services/product.service';
import { CommonService } from './../../../app/common/services/common.service';
import { EventEmitterService } from './../../../app/common/services/event-emitter-service';
import { HideShowDeleteWidgetsService } from './../../../app/common/services/hide-show-delete-widgets.service';
import { TabPanelService } from './../../../app/common/services/tab-panel.service';
import { ConfirmationGuardDialogComponent } from './../../../app/confirmation-guard-dialog/confirmation-guard-dialog.component';
import { ProductStateService } from './../../../app/corporate/trade/lc/common/services/product-state.service';


@Injectable({
  providedIn: 'root'
})
export class AutosaveGuard implements CanDeactivate<any> {
  private subject = new Subject<any>();
  mode: string;
  option: string;
  tabSectionControlMap: Map<string, Map<string, FCCFormControl>>;
  sectionNames: string[];
  public steps: any[] = [];
  displayConfirmationDialog: boolean;
  isAutoSaveValid: boolean;
  tabChange: boolean;
  constructor( protected productService: ProductService, protected router: Router,
    protected hideShowDeleteWidgetsService: HideShowDeleteWidgetsService,
    protected translateService: TranslateService, protected dialog: MatDialog,
    protected overlay: Overlay, protected route: ActivatedRoute, protected tabPanelService: TabPanelService,
    protected stateService: ProductStateService, protected dialogRefKey: MatDialog,
    protected commonService: CommonService, protected eventEmitterService: EventEmitterService,
    ) {}
    canDeactivate(component: any, currentRoute: any,
      currentState: RouterStateSnapshot,
      nextState?: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    let dialogRef;
      this.route.queryParams.subscribe(params => {
        this.mode = params.mode;
        this.option = params.option;
      });

      if (this.stateService.getAutoSaveConfig()?.isAutoSaveEnabled) {
        this.isAutoSaveValid = true;
      }else{
        this.isAutoSaveValid = false;
        return true;
      }
      const isConfirmationDialogueVisible = this.commonService.isConfirmationDialogueVisible.value;
      if (!isConfirmationDialogueVisible) {
        return true;
      }

      const section = this.stateService.getSectionNames();

      if (nextState.url === '/submit' || nextState.url === '/error') {
        return true;
      }

      if ( this.dialog.openDialogs.length === 0) {
        dialogRef = this.dialog.open(ConfirmationGuardDialogComponent, {
        panelClass: 'confirmDialogClass',
        scrollStrategy: this.overlay.scrollStrategies.noop(),
        height: 'auto',
        width: '37.5em',
        autoFocus: false,
        disableClose: false,
        hasBackdrop: true,
        data: { isBene : this.isAutoSaveValid }

       });
       this.commonService.isConfirmationDialogueVisible.next(false);
        dialogRef.afterClosed().subscribe(result => {
         let resp = false;
        if (result === 'saveForLater') {
          this.eventEmitterService.autoSaveForLater.next(section[0]);
          resp = true;
        } else if(result === 'cancel') {
          this.eventEmitterService.cancelTransaction.next(section[0]);
          resp = true;
        } else if(result === 'dontCancel') {
          resp = false;
        }
       this.subject.next(resp);
        });
      }
      return this.subject;
   }

}
