import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TemplateComponent } from './template.component';
import { ReactiveFormsModule } from '@angular/forms';
import { UiDynamicModule } from '../../../../../corporate/trade/ui/model/ui-dynamic/ui-dynamic.module';

@NgModule({
    declarations: [TemplateModule.rootComponent],
    imports: [CommonModule, UiDynamicModule, ReactiveFormsModule],
    exports: [TemplateModule.rootComponent]
})
export class TemplateModule {
  static rootComponent = TemplateComponent;
}
