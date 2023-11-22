import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FCCAmountComponent } from './fcc-amount.component';
import { CheckboxModule } from 'primeng/checkbox';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
    declarations: [AmountModule.rootComponent],
    imports: [CommonModule, TranslateModule, ReactiveFormsModule, CheckboxModule],
    exports: [AmountModule.rootComponent]
})
export class AmountModule {
  static rootComponent = FCCAmountComponent;
}
