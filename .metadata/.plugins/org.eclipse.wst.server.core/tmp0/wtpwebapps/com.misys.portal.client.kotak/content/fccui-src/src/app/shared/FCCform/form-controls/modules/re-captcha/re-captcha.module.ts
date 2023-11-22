import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReCaptchaComponent } from './re-captcha.component';
import { RecaptchaModule } from 'ng-recaptcha';
import { RecaptchaFormsModule } from 'ng-recaptcha';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
    declarations: [ReCaptchaModule.rootComponent],
    imports: [
        CommonModule,
        TranslateModule,
        RecaptchaModule,
        ReactiveFormsModule,
        RecaptchaFormsModule,
    ],
    exports: [ReCaptchaModule.rootComponent]
})
export class ReCaptchaModule {
  static rootComponent = ReCaptchaComponent;
}
