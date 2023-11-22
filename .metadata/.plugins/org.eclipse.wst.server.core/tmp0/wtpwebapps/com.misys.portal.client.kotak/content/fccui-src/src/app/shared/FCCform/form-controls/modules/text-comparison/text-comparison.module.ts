import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TextComparisonComponent } from './text-comparison.component';
import { FccLcModule } from './../../../../../corporate/trade/lc/fcc-lc.module';
import { TranslateModule } from '@ngx-translate/core';
import { MatIconModule } from '@angular/material/icon';
import { ReactiveFormsModule } from '@angular/forms';



@NgModule({
    declarations: [TextComparisonModule.rootComponent],
    imports: [CommonModule, TranslateModule, FccLcModule, MatIconModule, ReactiveFormsModule],
    exports: [TextComparisonModule.rootComponent]
})
export class TextComparisonModule {
  static rootComponent = TextComparisonComponent;

}
