import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UIDynamicComponent } from './ui-dynamic.component';

@NgModule({
  declarations: [UIDynamicComponent],
  imports: [
    CommonModule
  ],
  exports:[UIDynamicComponent]
})
export class UiDynamicModule { }
