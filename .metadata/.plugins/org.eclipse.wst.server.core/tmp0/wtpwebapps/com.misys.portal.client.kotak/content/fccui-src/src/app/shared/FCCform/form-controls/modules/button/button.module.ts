import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from './button.component';
import { ButtonModule } from 'primeng/button';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
    declarations: [FCCButtonModule.rootComponent],
    imports: [CommonModule, TranslateModule, ReactiveFormsModule, ButtonModule],
    exports: [FCCButtonModule.rootComponent]
})
export class FCCButtonModule {
  static rootComponent = ButtonComponent;
}
