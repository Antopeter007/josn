import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FileUploadComponent } from './file-upload.component';
import { FileUploadModule } from 'primeng/fileupload';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
    declarations: [FCCFileUploadModule.rootComponent],
    imports: [
        CommonModule,
        TranslateModule,
        ReactiveFormsModule,
        FileUploadModule,
    ],
    exports: [FCCFileUploadModule.rootComponent]
})
export class FCCFileUploadModule {
  static rootComponent = FileUploadComponent;
}
