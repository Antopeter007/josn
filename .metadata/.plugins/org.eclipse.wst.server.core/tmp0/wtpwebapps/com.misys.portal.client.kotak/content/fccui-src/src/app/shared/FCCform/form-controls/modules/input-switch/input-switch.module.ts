import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InputSwitchComponent } from './input-switch.component';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
    declarations: [InputSwitchModule.rootComponent],
    imports: [
        CommonModule,
        TranslateModule,
        ReactiveFormsModule,
        MatSlideToggleModule,
    ],
    exports: [InputSwitchModule.rootComponent]
})
export class InputSwitchModule {
  static rootComponent = InputSwitchComponent;
}
