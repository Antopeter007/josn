import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ViewModeComponent } from './view-mode.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
    declarations: [ViewModeModule.rootComponent],
    imports: [CommonModule, ReactiveFormsModule, MatIconModule, TranslateModule],
    exports: [ViewModeModule.rootComponent]
})
export class ViewModeModule {
  static rootComponent = ViewModeComponent;
}
