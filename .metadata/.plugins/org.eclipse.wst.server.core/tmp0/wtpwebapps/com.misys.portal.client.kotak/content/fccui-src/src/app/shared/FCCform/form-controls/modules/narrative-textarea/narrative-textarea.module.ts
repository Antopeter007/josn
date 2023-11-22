import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NarrativeTextareaComponent } from './narrative-textarea.component';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FccLcModule } from './../../../../../corporate/trade/lc/fcc-lc.module';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ReactiveFormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';

@NgModule({
    declarations: [NarrativeTextareaModule.rootComponent],
    imports: [
        CommonModule,
        TranslateModule,
        FccLcModule,
        OverlayPanelModule,
        MatInputModule,
        MatFormFieldModule,
        MatIconModule,
        MatTooltipModule,
        ReactiveFormsModule,
        TableModule,
    ],
    exports: [NarrativeTextareaModule.rootComponent]
})
export class NarrativeTextareaModule {
  static rootComponent = NarrativeTextareaComponent;
}
