import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { HighlightTexteditorComponent } from "./highlight-texteditor.component";
import { MatInputModule } from "@angular/material/input";
import { MatFormFieldModule } from "@angular/material/form-field";
import { FccLcModule } from "./../../../../../corporate/trade/lc/fcc-lc.module";
import { MatIconModule } from "@angular/material/icon";
import { TranslateModule } from "@ngx-translate/core";
import { MatTooltipModule } from "@angular/material/tooltip";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { HighlightEditorModule } from "../../helper-components/highlight-editor/highlight-editor.module";
import { OverlayPanelModule } from 'primeng/overlaypanel';

@NgModule({
    declarations: [HighlightTextEditorModule.rootComponent],
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
        OverlayPanelModule
    ],
    exports: [HighlightTextEditorModule.rootComponent]
})
export class HighlightTextEditorModule {
  static rootComponent = HighlightTexteditorComponent;
}
