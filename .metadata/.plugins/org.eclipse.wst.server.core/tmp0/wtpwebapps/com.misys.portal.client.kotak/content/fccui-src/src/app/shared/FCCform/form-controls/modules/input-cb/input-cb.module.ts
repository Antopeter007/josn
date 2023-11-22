import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InputCbComponent } from './input-cb.component';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
    declarations: [InputCbModule.rootComponent],
    imports: [
        CommonModule,
        TranslateModule,
        ReactiveFormsModule,
        OverlayPanelModule,
        MatCheckboxModule,
    ],
    exports: [InputCbModule.rootComponent]
})
export class InputCbModule {
  static rootComponent = InputCbComponent;
}
