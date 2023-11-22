import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TextValueComponent } from './text-value.component';
import { TranslateModule } from '@ngx-translate/core';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
    declarations: [TextValueModule.rootComponent],
    imports: [CommonModule, TranslateModule, ReactiveFormsModule],
    exports: [TextValueModule.rootComponent]
})
export class TextValueModule {
  static rootComponent = TextValueComponent;
}
