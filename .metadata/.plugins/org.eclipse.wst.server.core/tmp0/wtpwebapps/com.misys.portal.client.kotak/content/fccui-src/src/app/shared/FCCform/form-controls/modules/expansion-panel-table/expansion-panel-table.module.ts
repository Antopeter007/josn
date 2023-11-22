import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExpansionPanelTableComponent } from './expansion-panel-table.component';
import { AccordionModule } from 'primeng/accordion';
import { ReactiveFormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { TranslateModule } from '@ngx-translate/core';
import { MatExpansionModule } from '@angular/material/expansion';

@NgModule({
    declarations: [ExpansionPanelTableModule.rootComponent],
    imports: [
        CommonModule,
        TranslateModule,
        ReactiveFormsModule,
        AccordionModule,
        TableModule,
        MatExpansionModule,
    ],
    exports: [ExpansionPanelTableModule.rootComponent]
})
export class ExpansionPanelTableModule {
  static rootComponent = ExpansionPanelTableComponent;
}
