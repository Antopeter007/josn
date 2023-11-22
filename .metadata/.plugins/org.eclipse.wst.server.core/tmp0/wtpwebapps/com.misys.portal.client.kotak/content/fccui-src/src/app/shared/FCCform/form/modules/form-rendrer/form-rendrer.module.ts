import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormRendrerComponent } from './form-rendrer.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { MessageModule } from 'primeng';
import { FormControlResolverModule } from '../../../form-controls/form-control-resolver/form-control-resolver.module';



@NgModule({
  declarations: [FormRendrerComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MessageModule,
    TranslateModule,
    FormControlResolverModule,
  ], exports: [FormRendrerComponent]
})
export class FormRendrerModule { }
