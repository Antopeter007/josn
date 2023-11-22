import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExpansionPanelEditFormTableComponent } from './expansion-panel-edit-form-table.component';
import { AccordionModule } from 'primeng/accordion';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { TranslateModule } from '@ngx-translate/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { FccLcModule, UiDynamicModule } from 'public_api';
import { MatTableModule } from '@angular/material/table';
import { MatListModule } from '@angular/material/list';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatAutocompleteModule } from '@angular/material/autocomplete';


@NgModule({
    declarations: [ExpansionPanelEditFormTableModule.rootComponent],
    imports: [
        CommonModule,
        TranslateModule,
        ReactiveFormsModule,
        AccordionModule,
        TableModule,
        MatExpansionModule,
        FccLcModule,UiDynamicModule,
        MatTableModule, 
        MatListModule, 
        MatCheckboxModule, 
        MatPaginatorModule, 
        MatSelectModule, 
        MatDatepickerModule,
        MatFormFieldModule,
        MatInputModule,
        MatCardModule,
        FormsModule,
        MatIconModule,
        MatDividerModule,
        MatTooltipModule,
        MatAutocompleteModule
    ],
    exports: [ExpansionPanelEditFormTableModule.rootComponent]
})
export class ExpansionPanelEditFormTableModule {
  static rootComponent = ExpansionPanelEditFormTableComponent;
}
