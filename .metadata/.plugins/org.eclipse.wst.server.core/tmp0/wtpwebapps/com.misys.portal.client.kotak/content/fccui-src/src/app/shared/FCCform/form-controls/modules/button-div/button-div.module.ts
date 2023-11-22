import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonDivComponent } from './button-div.component';
import { MatButtonModule } from '@angular/material/button';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
    declarations: [ButtonDivModule.rootComponent],
    imports: [
        CommonModule,
        TranslateModule,
        ReactiveFormsModule,
        MatButtonModule,
    ],
    exports: [ButtonDivModule.rootComponent]
})
export class ButtonDivModule {
  static rootComponent = ButtonDivComponent;
}
