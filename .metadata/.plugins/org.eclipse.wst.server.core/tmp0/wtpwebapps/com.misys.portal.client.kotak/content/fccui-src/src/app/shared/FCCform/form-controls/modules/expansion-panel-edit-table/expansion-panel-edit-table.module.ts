import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { TranslateModule } from '@ngx-translate/core';
import { DropdownModule } from 'primeng';
import { AccordionModule } from 'primeng/accordion';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';

import { ExpansionPanelEditTableComponent } from './expansion-panel-edit-table.component';

@NgModule({
    declarations: [ExpansionPanelEditTableModule.rootComponent],
    imports: [
        CommonModule,
        TranslateModule,
        ReactiveFormsModule,
        MatCheckboxModule,
        AccordionModule,
        TableModule,
        MatFormFieldModule,
        MatInputModule,
        MatDatepickerModule,
        DropdownModule,
        FormsModule,
        InputTextModule
    ],
    exports: [ExpansionPanelEditTableModule.rootComponent]
})
export class ExpansionPanelEditTableModule {
  static rootComponent = ExpansionPanelEditTableComponent;
}
