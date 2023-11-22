import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogWindowComponent } from './dialog-window.component';
import { DialogModule } from 'primeng/dialog';
import { TableModule } from 'primeng/table';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
    declarations: [DialogWindowModule.rootComponent],
    imports: [
        CommonModule,
        TranslateModule,
        ReactiveFormsModule,
        DialogModule,
        TableModule,
    ],
    exports: [DialogWindowModule.rootComponent]
})
export class DialogWindowModule {
  static rootComponent = DialogWindowComponent;
}
