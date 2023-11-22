import { InjectionToken } from '@angular/core';
import { IFCCRegistrationConfig } from './form-control-resolver.model';

export const FORM_CONTROL_RESOLVER_CONFIG = new InjectionToken<IFCCRegistrationConfig[]>(
    'Registration Configuration for Form Resolvers'
);
