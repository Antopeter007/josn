import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FCCInputTextComponent } from './fcc-input-text.component';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
    declarations: [InputTextModule.rootComponent],
    imports: [
        CommonModule,
        TranslateModule,
        ReactiveFormsModule,
        OverlayPanelModule,
        MatInputModule,
        MatFormFieldModule,
    ],
    exports: [InputTextModule.rootComponent]
})
export class InputTextModule {
  static rootComponent = FCCInputTextComponent;
}
