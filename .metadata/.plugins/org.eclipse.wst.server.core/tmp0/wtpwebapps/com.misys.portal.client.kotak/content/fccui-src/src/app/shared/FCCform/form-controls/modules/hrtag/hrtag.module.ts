import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HRTAGComponent } from './hrtag.component';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
    declarations: [HRTAGModule.rootComponent],
    imports: [CommonModule, ReactiveFormsModule],
    exports: [HRTAGModule.rootComponent]
})
export class HRTAGModule {
  static rootComponent = HRTAGComponent;
}
