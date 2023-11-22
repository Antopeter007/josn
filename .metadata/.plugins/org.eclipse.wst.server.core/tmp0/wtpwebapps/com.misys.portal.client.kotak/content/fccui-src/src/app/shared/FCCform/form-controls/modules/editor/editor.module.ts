import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EditorComponent } from './editor.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { AngularEditorModule } from '@kolkov/angular-editor';


@NgModule({
    declarations: [EditorModule.rootComponent],
    imports: [
        CommonModule,
        TranslateModule,
        ReactiveFormsModule,
        AngularEditorModule,
        FormsModule,
    ],
    exports: [EditorModule.rootComponent]
})
export class EditorModule {
  static rootComponent = EditorComponent;

 }
