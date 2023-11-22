import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InputRadioCheckComponent } from './input-radio-check.component';
import { MatRadioModule } from '@angular/material/radio';
import { ReactiveFormsModule } from '@angular/forms';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
    declarations: [InputRadioCheckModule.rootComponent],
    imports: [
        CommonModule,
        TranslateModule,
        ReactiveFormsModule,
        MatRadioModule,
        OverlayPanelModule,
    ],
    exports: [InputRadioCheckModule.rootComponent]
})
export class InputRadioCheckModule {
  static rootComponent = InputRadioCheckComponent;
}
