import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InputTextareaComponent } from './input-textarea.component';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ReactiveFormsModule } from '@angular/forms';
import { FccLcModule } from './../../../../../corporate/trade/lc/fcc-lc.module';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
    declarations: [InputTextareaModule.rootComponent],
    imports: [
        CommonModule,
        TranslateModule,
        ReactiveFormsModule,
        FccLcModule,
        OverlayPanelModule,
        MatFormFieldModule,
    ],
    exports: [InputTextareaModule.rootComponent]
})
export class InputTextareaModule {
  static rootComponent = InputTextareaComponent;
}
