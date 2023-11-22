import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { TimerModule } from '../../../../../common/widgets/components/timer/timer.module';
import { FCCTimerComponent } from './fcc-timer.component';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
    declarations: [FCCTimerModule.rootComponent],
    imports: [CommonModule, TranslateModule, TimerModule, ReactiveFormsModule],
    exports: [FCCTimerModule.rootComponent]
})
export class FCCTimerModule {
  static rootComponent = FCCTimerComponent;
}
