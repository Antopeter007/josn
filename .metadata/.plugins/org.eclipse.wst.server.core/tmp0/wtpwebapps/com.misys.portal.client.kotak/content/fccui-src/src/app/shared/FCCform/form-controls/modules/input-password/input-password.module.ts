import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InputPasswordComponent } from './input-password.component';
import { ReactiveFormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
    declarations: [InputPasswordModule.rootComponent],
    imports: [
        CommonModule,
        TranslateModule,
        ReactiveFormsModule,
        InputTextModule,
    ],
    exports: [InputPasswordModule.rootComponent]
})
export class InputPasswordModule {
  static rootComponent = InputPasswordComponent;
}
