import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormTableComponent } from './form-table.component';
import { TableModule } from 'primeng/table';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { OverlayPanelModule } from 'primeng/overlaypanel';

@NgModule({
    declarations: [FormTableModule.rootComponent],
    imports: [
        CommonModule,
        TranslateModule,
        ReactiveFormsModule,
        TableModule,
        OverlayPanelModule,
    ],
    exports: [FormTableModule.rootComponent]
})
export class FormTableModule {
  static rootComponent = FormTableComponent;
}
