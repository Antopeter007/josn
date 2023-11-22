import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardViewComponent } from './card-view.component';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { CardModule } from 'primeng/card';

@NgModule({
    declarations: [CardViewModule.rootComponent],
    imports: [CommonModule, TranslateModule, ReactiveFormsModule, CardModule],
    exports: [CardViewModule.rootComponent]
})
export class CardViewModule {
  static rootComponent = CardViewComponent;
}
