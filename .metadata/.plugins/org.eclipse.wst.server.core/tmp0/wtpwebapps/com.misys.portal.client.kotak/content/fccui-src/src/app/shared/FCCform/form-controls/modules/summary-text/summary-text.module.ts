import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SummaryTextComponent } from './summary-text.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';
import { FccLcModule } from '../../../../../corporate/trade/lc/fcc-lc.module';




@NgModule({
    declarations: [SummaryTextModule.rootComponent],
    imports: [CommonModule, TranslateModule, FccLcModule, MatIconModule, ReactiveFormsModule],
    exports: [SummaryTextModule.rootComponent]
})
export class SummaryTextModule {
  static rootComponent = SummaryTextComponent;

}
