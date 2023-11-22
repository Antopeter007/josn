
import {
  Component, Input, OnInit, OnDestroy,
  ViewChild, ViewContainerRef,
  ComponentFactoryResolver, ComponentRef, Output, EventEmitter
} from '@angular/core';
import { Router } from '@angular/router';
import { FCCFormGroup } from '../model/fcc-control.model';
import { DynamicContentComponentService } from '../services/dynamic-content-component.service';

@Component({
  selector: 'dynamic-content',
  template: `<ng-template #container></ng-template>`
})
export class DynamicContentComponent implements OnInit, OnDestroy {

  @ViewChild('container', { read: ViewContainerRef, static: true })
  public container: ViewContainerRef;

  @Input() controlName: any;

  @Input() containerType: any;
  @Input() isSubmitEnabled: any;
  @Input() buttonStyle: any;
  @Input() submitClicked: any;

  @Input()
  parentForm: FCCFormGroup;

  @Input()
  data: any;

  @Input()
  type: any = '';

  @Input()
  eventTypeCode: any = '';

  @Input()
  subTnxTypeCode: any = '';

  @Input()
  dashboardType: any = '';

  @Input()
  context: any;

  @Input()
  eventRequired: any;

  @Input()
  accordionViewRequired: any;

  @Input()
  isMasterView: any;

  @Input()
  stateType: any = '';

  @Input()
  stateId: any = '';

  @Input()
  isMasterRequired: any = false;

  @Input()
  isAmendComparison: any = false;

  @Input()
  dashboardName: any;

  @Input()
  widgetDetails: any;
  UnknownDynamicComponent = 'UnknownDynamicComponent';
  private componentRef: ComponentRef<{}>;
  public state;

  @Output() checkSubmitStatus: EventEmitter<any> = new EventEmitter();

  @Output() checkAutosavedTimestamp: EventEmitter<any> = new EventEmitter();

  @Output() previousClick: EventEmitter<any> = new EventEmitter();

  @Output() nextClick: EventEmitter<any> = new EventEmitter();

  @Output() submitClick: EventEmitter<any> = new EventEmitter();

  constructor(
      public componentFactoryResolver: ComponentFactoryResolver, public router: Router,
      public dynamicCompService: DynamicContentComponentService) {
  }
// Moving below method to service which will be helpful for SDK purpose
  // getComponentType(typeName: string) {
  //     const type = Mapping.mappings[typeName];
  //     return type || this.UnknownDynamicComponent;
  // }

  ngOnInit() {
      if (this.type) {
          const componentType = this.dynamicCompService.getComponentType(this.type);
          // note: componentType must be declared within module.entryComponents
          const factory = this.componentFactoryResolver.resolveComponentFactory(componentType);
          this.container.clear();
          this.state = this.container.createComponent(factory).instance;
          this.state.dashboardName = this.dashboardName || this.router.url;
          this.state.widgetDetails = this.widgetDetails;
          this.state.eventRequired = this.eventRequired;
          this.state.accordionViewRequired = this.accordionViewRequired;
          this.state.isMasterView = this.isMasterView;
          this.state.parentForm = this.parentForm;
          this.state.data =  this.data;
          this.state.controlName = this.controlName;
          this.state.eventTypeCode = this.eventTypeCode;
          this.state.subTnxTypeCode = this.subTnxTypeCode;
          this.state.stateType = this.stateType;
          this.state.stateId = this.stateId;
          this.state.isMasterRequired = this.isMasterRequired;
          this.state.containerType = this.containerType;
          this.state.isSubmitEnabled = this.isSubmitEnabled;
          this.state.buttonStyle = this.buttonStyle;
          this.state.submitClicked = this.submitClicked;
          this.state.isAmendComparison = this.isAmendComparison;
          this.state.checkSubmitStatus?.subscribe((res) => {
            this.checkSubmitStatus.emit(res);
          });
          this.state.checkAutosavedTimestamp?.subscribe((res) => {
            this.checkAutosavedTimestamp.emit(res);
          });
          this.state?.nextClick?.subscribe(() => {
            this.nextClick.emit();
          });
          this.state?.previousClick?.subscribe(() => {
            this.previousClick.emit();
          });
          this.state?.submitClick?.subscribe(() => {
            this.submitClick.emit();
          });
      }
  }


  ngOnDestroy() {
      if (this.componentRef) {
          this.componentRef.destroy();
          this.componentRef = null;
      }
  }

}

export abstract class DynamicComponent {
  context: any;
}
