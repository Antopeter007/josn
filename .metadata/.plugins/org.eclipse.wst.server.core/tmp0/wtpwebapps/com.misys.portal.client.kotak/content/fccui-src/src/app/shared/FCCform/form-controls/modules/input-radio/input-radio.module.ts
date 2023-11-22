import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InputRadioComponent } from './input-radio.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MatRadioModule } from '@angular/material/radio';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
    declarations: [InputRadioModule.rootComponent],
    imports: [
        CommonModule,
        TranslateModule,
        ReactiveFormsModule,
        MatRadioModule,
        OverlayPanelModule,
    ],
    exports: [InputRadioModule.rootComponent]
})
export class InputRadioModule {
  static rootComponent = InputRadioComponent;
}
