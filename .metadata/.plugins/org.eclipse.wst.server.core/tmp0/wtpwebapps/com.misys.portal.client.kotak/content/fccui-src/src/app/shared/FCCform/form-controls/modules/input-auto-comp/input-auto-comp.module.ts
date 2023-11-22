import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InputAutoCompComponent } from './input-auto-comp.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { TranslateModule } from '@ngx-translate/core';
import { MatInputModule } from '@angular/material/input';
import { OverlayPanelModule } from 'primeng/overlaypanel';

@NgModule({
    declarations: [InputAutoCompModule.rootComponent],
    imports: [
        CommonModule,
        TranslateModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatIconModule,
        MatAutocompleteModule,
        OverlayPanelModule,
    ],
    exports: [InputAutoCompModule.rootComponent]
})
export class InputAutoCompModule {
  static rootComponent = InputAutoCompComponent;

}
