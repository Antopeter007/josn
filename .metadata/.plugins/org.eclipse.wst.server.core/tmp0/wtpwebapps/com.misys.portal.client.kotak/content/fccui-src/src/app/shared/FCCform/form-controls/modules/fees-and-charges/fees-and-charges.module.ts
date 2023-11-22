import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FeesAndChargesComponent } from './fees-and-charges.component';
import { ReactiveFormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
    declarations: [FeesAndChargesModule.rootComponent],
    imports: [CommonModule, TranslateModule, ReactiveFormsModule, TableModule],
    exports: [FeesAndChargesModule.rootComponent]
})
export class FeesAndChargesModule {
  static rootComponent = FeesAndChargesComponent;
}
