import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RoundedButtonComponent } from './rounded-button.component';
import { MatButtonModule } from '@angular/material/button';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
    declarations: [RoundedButtonModule.rootComponent],
    imports: [
        CommonModule,
        TranslateModule,
        ReactiveFormsModule,
        MatButtonModule,
    ],
    exports: [RoundedButtonModule.rootComponent]
})
export class RoundedButtonModule {
  static rootComponent = RoundedButtonComponent;
}
