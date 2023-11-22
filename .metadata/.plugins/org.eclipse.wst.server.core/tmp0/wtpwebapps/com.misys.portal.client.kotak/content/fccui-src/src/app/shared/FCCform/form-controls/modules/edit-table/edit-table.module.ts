import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EditTableComponent } from './edit-table.component';
import { TableModule } from 'primeng/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { DropdownModule } from 'primeng/dropdown';
import { TranslateModule } from '@ngx-translate/core';
import { InputTextModule } from 'primeng/inputtext';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MessageModule } from 'primeng';
import { MessagesModule } from 'primeng';
import { FccCommonModule } from './../../../../../common/fcc-common.module';

@NgModule({
    declarations: [EditTableModule.rootComponent],
    imports: [
        CommonModule, TranslateModule,
        ReactiveFormsModule,
        TableModule,
        MatTooltipModule,
        MatFormFieldModule,
        MatInputModule,
        MatDatepickerModule,
        DropdownModule,
        FormsModule,
        InputTextModule,
        MatCheckboxModule,
        MessageModule,
        MessagesModule,
        FccCommonModule
    ],
    exports: [EditTableModule.rootComponent]
})
export class EditTableModule {
  static rootComponent = EditTableComponent;

}
