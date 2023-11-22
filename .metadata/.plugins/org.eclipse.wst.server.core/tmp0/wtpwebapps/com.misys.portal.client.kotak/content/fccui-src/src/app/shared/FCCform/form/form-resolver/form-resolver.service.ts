import {
  ComponentFactoryResolver,
  ComponentRef,
  Injectable,
  Type,
  ViewContainerRef,
} from "@angular/core";
import { IFormData, IFormWithEmitter } from "./form-resolver.model";

@Injectable({
  providedIn: "root",
})
export class FormResolverService {
  constructor(
    private factoryResolver: ComponentFactoryResolver //eslint-disable-line @typescript-eslint/no-parameter-properties
  ) {}

  resolveForms(
    componentData: IFormData,
    viewContainerRef: ViewContainerRef,
    component: Type<any>
  ): ComponentRef<IFormWithEmitter> {
    const factory = this.factoryResolver.resolveComponentFactory(component);
    viewContainerRef.clear();
    const componentRef: ComponentRef<any> =
      viewContainerRef.createComponent(factory);
    componentRef.instance.module = componentData.module;
    componentRef.instance.formGroup = componentData.formGroup;
    componentRef.instance.mode = componentData.mode;
    componentRef.instance.hostComponentData = componentData.hostComponentData;
    return componentRef;
  }
}
