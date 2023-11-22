import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InputDropdownFilterComponent } from './input-dropdown-filter.component';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { DropdownModule } from 'primeng/dropdown';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
    declarations: [InputDropdownFilterModule.rootComponent],
    imports: [
        CommonModule,
        TranslateModule,
        ReactiveFormsModule,
        OverlayPanelModule,
        DropdownModule,
    ],
    exports: [InputDropdownFilterModule.rootComponent]
})
export class InputDropdownFilterModule {
  static rootComponent = InputDropdownFilterComponent;
}
