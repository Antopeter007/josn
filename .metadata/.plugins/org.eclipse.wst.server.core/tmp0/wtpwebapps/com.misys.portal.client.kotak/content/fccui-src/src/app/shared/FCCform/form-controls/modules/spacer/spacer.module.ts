import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SpacerComponent } from './spacer.component';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
    declarations: [SpacerModule.rootComponent],
    imports: [CommonModule, ReactiveFormsModule],
    exports: [SpacerModule.rootComponent]
})
export class SpacerModule {
  static rootComponent = SpacerComponent;
}
