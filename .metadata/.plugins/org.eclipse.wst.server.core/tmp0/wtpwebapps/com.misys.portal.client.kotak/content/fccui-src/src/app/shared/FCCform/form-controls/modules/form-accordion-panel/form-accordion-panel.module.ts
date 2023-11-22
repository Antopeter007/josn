import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormAccordionPanelComponent } from './form-accordion-panel.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';
import { UiDynamicModule } from './../../../../../corporate/trade/ui/model/ui-dynamic/ui-dynamic.module';

@NgModule({
    declarations: [FormAccordionPanelModule.rootComponent],
    imports: [
        CommonModule,
        TranslateModule,
        ReactiveFormsModule,
        MatExpansionModule,
        MatIconModule,
        UiDynamicModule,
    ],
    exports: [FormAccordionPanelModule.rootComponent]
})
export class FormAccordionPanelModule {
  static rootComponent = FormAccordionPanelComponent;
}
