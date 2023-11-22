import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InputMultiselectComponent } from './input-multiselect.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MultiSelectModule } from 'primeng/multiselect';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
    declarations: [InputMultiselectModule.rootComponent],
    imports: [
        CommonModule,
        TranslateModule,
        ReactiveFormsModule,
        MultiSelectModule,
    ],
    exports: [InputMultiselectModule.rootComponent]
})
export class InputMultiselectModule {
  static rootComponent = InputMultiselectComponent;
}
