import {
  ComponentFactoryResolver,
  ComponentRef,
  Inject,
  Injectable,
  Type,
  ViewContainerRef,
} from "@angular/core";
import { FORM_CONTROL_RESOLVER_CONFIG } from "./form-control-resolver.constant";
import {
  IFCCRegistrationConfig,
  IFormControlData,
  IUpdateFccBase,
} from "./form-control-resolver.model";
import { UnresolvedFormControlComponent } from "./unresolved-form-control/unresolved-form-control.component";

@Injectable({
  providedIn: "root",
})
export class FormControlResolverService {
  isIntialised = false;

  constructor(
    private componentFactoryResolver: ComponentFactoryResolver, //eslint-disable-line @typescript-eslint/no-parameter-properties
    @Inject(FORM_CONTROL_RESOLVER_CONFIG) //eslint-disable-line @typescript-eslint/no-parameter-properties
    private formConfig: null | IFCCRegistrationConfig[] 
  ) {}

  private availableRegistererdForms: Map<
    string,
    IFCCRegistrationConfig
  > | null = null;
  static getFormType(formType: string) {
    return `fcc:${formType}`;
  }

  getAllRegisteredForms() {
    return this.availableRegistererdForms;
  }

  registerNewFormControl(
    controlKey: string,
    componentName: Type<IUpdateFccBase>
  ): boolean {
    const key = FormControlResolverService.getFormType(controlKey);
    if (this.isIntialised && this.availableRegistererdForms.has(key)) {
      return false;
    }
    this.setAvailableRegistererdForms(key, controlKey, componentName);
    return true;
  }

  useClientFormControlComponent(
    controlKey: string,
    componentName: Type<IUpdateFccBase>
  ): boolean {
    const key = FormControlResolverService.getFormType(controlKey);
    if (this.initialize && !this.availableRegistererdForms.has(key)) {
      return false;
    }
    this.setAvailableRegistererdForms(key, controlKey, componentName);
    return true;
  }

  private setAvailableRegistererdForms(
    key: string,
    controlKey: string,
    componentName: Type<IUpdateFccBase>
  ) {
    const value = {} as IFCCRegistrationConfig;
    value.type = controlKey;
    value.component = componentName;
    this.availableRegistererdForms.set(key, value);
  }

  initialize() {
    const registraionConfig: Map<string, IFCCRegistrationConfig> = new Map();
    const allFormConfigurations: IFCCRegistrationConfig[] = [];

    if (this.formConfig && Array.isArray(this.formConfig)) {
      allFormConfigurations.push(...this.formConfig);
    }
    allFormConfigurations.forEach((value) => {
      const key = FormControlResolverService.getFormType(value.type);
      registraionConfig.set(key, value);
    });
    this.availableRegistererdForms = registraionConfig;
    this.isIntialised = true;
  }

  resolveForms(
    receivedConfig: IFormControlData,
    containerRef: ViewContainerRef
  ) {
    const key = FormControlResolverService.getFormType(
      receivedConfig.control.type
    );
    if (
      this.availableRegistererdForms &&
      this.availableRegistererdForms.has(key)
    ) {
      const config = this.availableRegistererdForms.get(key);
      if (config && config.component) {
        return this.formResolved(
          containerRef,
          receivedConfig,
          config.component
        );
      }
    }
    return this.formResolved(
      containerRef,
      receivedConfig,
      UnresolvedFormControlComponent
    );
  }

  private formResolved(
    containerRef: ViewContainerRef,
    componentData: IFormControlData,
    component: Type<IUpdateFccBase>
  ): ComponentRef<IUpdateFccBase> {
    const factory =
      this.componentFactoryResolver.resolveComponentFactory(component);
    containerRef.clear();
    const componentRef: ComponentRef<IUpdateFccBase> =
      containerRef.createComponent(factory);
    componentRef.instance.control = componentData.control;
    componentRef.instance.form = componentData.form;
    componentRef.instance.mode = componentData.mode;
    componentRef.instance.hostComponentData = componentData.hostComponentData;
    if (componentRef.instance.updateFccBaseComponent) {
      componentRef.instance.updateFccBaseComponent(
        componentData.hostComponentData,
        componentData.mode
      );
    }
    return componentRef;
  }
}
