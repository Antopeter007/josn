import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ComponentFactoryResolver,
  ComponentRef,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  Output,
  ViewChild,
  ViewContainerRef
} from '@angular/core';
import { Mapping } from '../../../../base/model/mapping';
import { StepViewDirective } from '../../../directives/step-view.directive';

@Component({
  selector: 'app-stepper-wrapper',
  template: `
    <ng-template appStepView></ng-template>
  `
})
export class StepperWrapperComponent
  implements AfterViewInit, OnChanges, OnDestroy {
  @Input() item: any;
  @Output() onNotifyStep = new EventEmitter<any>();
  @ViewChild(StepViewDirective, { read: ViewContainerRef, static: true })
  stepViewHost;

  public componentRef: ComponentRef<any>;
  private isViewInitialized = false;

  constructor(
    protected componentFactoryResolver: ComponentFactoryResolver,
    protected cdref: ChangeDetectorRef
  ) {}

  getComponentType(typeName: string) {
    const type = Mapping.mappings[typeName];
    return type;
  }

  loadComponent() {
    if (!this.isViewInitialized) {
      return;
    }
    this.stepViewHost.clear();
    const componentType = this.getComponentType(this.item);
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(
      componentType
    );
    //  const componentFactory = this.componentFactoryResolver.resolveComponentFactory(this.item);
    this.componentRef = this.stepViewHost.createComponent(componentFactory);
    this.cdref.detectChanges();
    // (this.componentRef.instance as StepsOutput).notify.subscribe(data =>
    //   //this.onNotify(data)
    // );
    // (<FCCBase>this.componentRef.instance).context = '';
  }

  ngAfterViewInit() {
    this.isViewInitialized = true;
    this.loadComponent();
  }

  ngOnChanges() {
    this.loadComponent();
  }

  ngOnDestroy() {
    if (this.componentRef) {
      this.componentRef.destroy();
    }
  }
}
