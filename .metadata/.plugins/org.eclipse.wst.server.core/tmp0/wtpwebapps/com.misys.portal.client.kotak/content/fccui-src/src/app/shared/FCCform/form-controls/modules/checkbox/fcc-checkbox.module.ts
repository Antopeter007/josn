import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FCCCheckboxComponent } from './fcc-checkbox.component';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
    declarations: [CheckboxModule.rootComponent],
    imports: [
        CommonModule,
        TranslateModule,
        ReactiveFormsModule,
        OverlayPanelModule,
        MatCheckboxModule,
    ],
    exports: [CheckboxModule.rootComponent]
})
export class CheckboxModule {
  static rootComponent = FCCCheckboxComponent;
}
