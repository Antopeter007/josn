import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[appStepView]'
})
export class StepViewDirective {

  constructor(public viewContainerRef: ViewContainerRef) { }

}
