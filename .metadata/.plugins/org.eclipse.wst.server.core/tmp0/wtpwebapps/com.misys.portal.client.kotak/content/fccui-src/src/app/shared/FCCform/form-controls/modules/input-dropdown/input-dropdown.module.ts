import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InputDropdownComponent } from './input-dropdown.component';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { HyperlinkModule } from '../../helper-components/hyperlink/hyperlink.module';
import { InputCbModule } from '../input-cb/input-cb.module';
import { CheckboxModule } from '../checkbox/fcc-checkbox.module';

@NgModule({
    declarations: [InputDropdownModule.rootComponent],
    imports: [
        CommonModule,
        TranslateModule,
        ReactiveFormsModule,
        OverlayPanelModule,
        MatFormFieldModule,
        MatSelectModule,
        HyperlinkModule,
        InputCbModule,
        CheckboxModule
    ],
    exports: [InputDropdownModule.rootComponent]
})
export class InputDropdownModule {
  static rootComponent = InputDropdownComponent;
}
