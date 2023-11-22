import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormResolverDirective } from './form-resolver.directive';
import { FormRendrerModule } from '../modules/form-rendrer/form-rendrer.module';

@NgModule({
  declarations: [FormResolverDirective],
  imports: [CommonModule, FormRendrerModule],
  exports: [FormResolverDirective],
})
export class FormResolverModule {}
