import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProgressBarComponent } from './progress-bar.component';
import { ProgressBarModule } from 'primeng/progressbar';
import { TranslateModule } from '@ngx-translate/core';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
    declarations: [FCCProgressBarModule.rootComponent],
    imports: [CommonModule, TranslateModule, ProgressBarModule, ReactiveFormsModule],
    exports: [FCCProgressBarModule.rootComponent]
})
export class FCCProgressBarModule {
  static rootComponent = ProgressBarComponent;
}
