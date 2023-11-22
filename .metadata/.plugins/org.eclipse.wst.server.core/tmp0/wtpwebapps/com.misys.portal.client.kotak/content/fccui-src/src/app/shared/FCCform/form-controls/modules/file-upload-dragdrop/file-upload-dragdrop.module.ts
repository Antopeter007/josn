import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FileUploadDragdropComponent } from './file-upload-dragdrop.component';
import { FileUploadModule } from 'primeng/fileupload';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
    declarations: [FileUploadDragdropModule.rootComponent],
    imports: [
        CommonModule,
        TranslateModule,
        ReactiveFormsModule,
        FileUploadModule,
    ],
    exports: [FileUploadDragdropModule.rootComponent]
})
export class FileUploadDragdropModule {
  static rootComponent = FileUploadDragdropComponent;
}
