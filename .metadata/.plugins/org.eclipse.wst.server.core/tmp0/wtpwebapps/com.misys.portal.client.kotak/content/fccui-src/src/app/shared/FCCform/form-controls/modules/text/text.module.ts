import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TextComponent } from './text.component';
import { FccLcModule } from './../../../../../corporate/trade/lc/fcc-lc.module';
import { TranslateModule } from '@ngx-translate/core';
import { MatIconModule } from '@angular/material/icon';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
    declarations: [TextModule.rootComponent],
    imports: [CommonModule, TranslateModule, FccLcModule, MatIconModule, ReactiveFormsModule],
    exports: [TextModule.rootComponent]
})
export class TextModule {
  static rootComponent = TextComponent;
}
