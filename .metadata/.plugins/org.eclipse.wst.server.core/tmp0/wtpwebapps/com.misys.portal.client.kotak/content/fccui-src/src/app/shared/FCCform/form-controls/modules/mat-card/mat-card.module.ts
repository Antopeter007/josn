import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardComponent } from './mat-card.component';
import { MatCardModule } from '@angular/material/card';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
    declarations: [FCCMatCardModule.rootComponent],
    imports: [CommonModule, TranslateModule, ReactiveFormsModule, MatCardModule],
    exports: [FCCMatCardModule.rootComponent]
})
export class FCCMatCardModule {
  static rootComponent = MatCardComponent;
}
