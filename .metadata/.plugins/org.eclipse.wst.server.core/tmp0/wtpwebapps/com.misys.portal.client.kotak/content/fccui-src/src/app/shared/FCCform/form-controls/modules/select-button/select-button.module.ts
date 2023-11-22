import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SelectButtonComponent } from './select-button.component';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatIconModule } from '@angular/material/icon';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
    declarations: [SelectButtonModule.rootComponent],
    imports: [
        CommonModule,
        TranslateModule,
        ReactiveFormsModule,
        MatButtonToggleModule,
        MatIconModule,
        OverlayPanelModule,
    ],
    exports: [SelectButtonModule.rootComponent]
})
export class SelectButtonModule {
  static rootComponent = SelectButtonComponent;
}
