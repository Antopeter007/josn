import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InputBackdateComponent } from './input-backdate.component';
import { CalendarModule } from 'primeng/calendar';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { TranslateModule } from '@ngx-translate/core';
import { MatInputModule } from '@angular/material/input';

@NgModule({
    declarations: [InputBackdateModule.rootComponent],
    imports: [
        CommonModule,
        TranslateModule,
        ReactiveFormsModule,
        CalendarModule,
        OverlayPanelModule,
        MatFormFieldModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatInputModule
    ],
    exports: [InputBackdateModule.rootComponent]
})
export class InputBackdateModule {
  static rootComponent = InputBackdateComponent;
}
