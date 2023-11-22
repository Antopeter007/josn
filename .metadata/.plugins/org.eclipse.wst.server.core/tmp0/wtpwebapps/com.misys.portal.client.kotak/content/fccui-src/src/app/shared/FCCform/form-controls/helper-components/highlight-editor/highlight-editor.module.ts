import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HighlightEditorComponent } from './highlight-editor.component';
import { HighlightHtmlPipe } from './highlight-html.pipe';



@NgModule({
  declarations: [HighlightEditorComponent, HighlightHtmlPipe],
  imports: [
    CommonModule
  ],
  providers:[HighlightHtmlPipe],
  exports:[HighlightEditorComponent]
})
export class HighlightEditorModule { }
