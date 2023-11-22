import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { TranslateModule } from '@ngx-translate/core';
import { CalendarModule } from 'primeng/calendar';
import { InputDateRangeComponent } from './input-date-range.component';
import { TooltipModule } from 'primeng';
import { MatIconModule } from '@angular/material/icon';

@NgModule({
  declarations: [InputDateRangeModule.rootComponent],
  imports: [
    CommonModule,
    TranslateModule,
    ReactiveFormsModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatFormFieldModule,
    MatInputModule,
    OverlayPanelModule,
    CalendarModule,
    TooltipModule,
    MatIconModule
  ],
  entryComponents: [InputDateRangeModule.rootComponent],
  exports: [InputDateRangeModule.rootComponent],
})
export class InputDateRangeModule {
  static rootComponent = InputDateRangeComponent;
}
