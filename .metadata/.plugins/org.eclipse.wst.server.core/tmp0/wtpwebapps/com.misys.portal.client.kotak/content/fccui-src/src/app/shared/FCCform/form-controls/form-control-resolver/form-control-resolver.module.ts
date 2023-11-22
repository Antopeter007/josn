import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IFCCRegistrationConfig } from './form-control-resolver.model';
import { FORM_CONTROL_RESOLVER_CONFIG } from './form-control-resolver.constant';
import { UnresolvedFormControlComponent } from './unresolved-form-control/unresolved-form-control.component';
import { FormControlResolverService } from './form-control-resolver.service';
import { FormControlResolverDirective } from './form-control-resolver.directive';

@NgModule({
    declarations: [FormControlResolverDirective, UnresolvedFormControlComponent],
    imports: [
        CommonModule,
    ],
    exports: [FormControlResolverDirective, UnresolvedFormControlComponent]
})
export class FormControlResolverModule {
  static forRoot(config: IFCCRegistrationConfig[]): ModuleWithProviders<FormControlResolverModule>{
    return {
      ngModule: FormControlResolverModule,
      providers: [
        FormControlResolverService,
        {
          provide: FORM_CONTROL_RESOLVER_CONFIG,
          useValue: config
        }
      ]
    };
  }
 }
