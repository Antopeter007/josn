import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InputTableComponent } from './input-table.component';
import { TableModule } from 'primeng/table';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { MatTooltipModule } from '@angular/material/tooltip';

@NgModule({
    declarations: [InputTableModule.rootComponent],
    imports: [
        CommonModule,
        TranslateModule,
        ReactiveFormsModule,
        TableModule,
        MatTooltipModule,
    ],
    exports: [InputTableModule.rootComponent]
})
export class InputTableModule {
  static rootComponent = InputTableComponent;
}
