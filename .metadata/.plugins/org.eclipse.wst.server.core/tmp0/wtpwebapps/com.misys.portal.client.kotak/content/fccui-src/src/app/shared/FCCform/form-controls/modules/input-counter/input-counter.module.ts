import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { TranslateModule } from '@ngx-translate/core';
import { HyperlinkModule } from '../../helper-components/hyperlink/hyperlink.module';
import { InputCounterComponent } from './input-counter.component';

@NgModule({
    declarations: [InputCounterModule.rootComponent],
    imports: [
        CommonModule,
        TranslateModule,
        ReactiveFormsModule,
        MatButtonModule,
        MatInputModule,
        MatFormFieldModule,
        MatIconModule,
        HyperlinkModule
    ],
    exports: [InputCounterModule.rootComponent]
})
export class InputCounterModule {
  static rootComponent = InputCounterComponent;
}
