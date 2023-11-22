import { Injectable, EventEmitter, Output } from '@angular/core';
import { Subscription } from 'rxjs/internal/Subscription';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EventEmitterService {
  subFlag: BehaviorSubject<boolean> = new BehaviorSubject(false);
  autoSaveForLater : BehaviorSubject<any> = new BehaviorSubject(null);
  cancelTransaction : BehaviorSubject<any> = new BehaviorSubject(null);
  autoSaveDetails : BehaviorSubject<any> = new BehaviorSubject(null);
  renderSavedValues : BehaviorSubject<any> = new BehaviorSubject(null);
  renderSavedEnrichValues : BehaviorSubject<any> = new BehaviorSubject(null);
  @Output() submitEvent = new EventEmitter();
  invokeProductComponentSaveFunction = new EventEmitter();
  invokeProductComponentSaveNewFunction = new EventEmitter();
  invokeSaveForLater = new EventEmitter();

  subsVar: Subscription;
  subsVarData: Subscription;
  subsPopUpData: Subscription;
  constructor() {
    //eslint : no-empty-function
   }
  // getSubmitEvent() {
  //   this.submitEvent.emit();
  // }
  emitSubmitEvent() {
    this.submitEvent.emit();
  }
  getSubmitEvent(): any {
    return this.submitEvent;
  }
  onConfirmationSave() {
    this.invokeProductComponentSaveFunction.emit();
  }
  onNewLoanSave() {
    this.invokeProductComponentSaveNewFunction.emit();
  }

}
