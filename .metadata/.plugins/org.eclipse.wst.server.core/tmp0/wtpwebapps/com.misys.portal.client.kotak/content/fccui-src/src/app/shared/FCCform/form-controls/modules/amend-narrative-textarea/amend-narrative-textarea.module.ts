import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FccLcModule } from "./../../../../../corporate/trade/lc/fcc-lc.module";
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { TranslateModule } from '@ngx-translate/core';
import { HighlightEditorModule } from '../../helper-components/highlight-editor/highlight-editor.module';

import { AmendNarrativeTextareaComponent } from './amend-narrative-textarea.component';
import { MatTooltipModule } from '@angular/material/tooltip';

@NgModule({
    declarations: [AmendNarrativeTextareaModule.rootComponent],
    imports: [
        CommonModule,
        TranslateModule,
        FccLcModule,
        MatInputModule,
        MatFormFieldModule,
        MatIconModule,
        MatTooltipModule,
        ReactiveFormsModule,
        FormsModule,
        HighlightEditorModule,
    ],
    exports: [AmendNarrativeTextareaModule.rootComponent]
})
export class AmendNarrativeTextareaModule {
  static rootComponent = AmendNarrativeTextareaComponent;

}
