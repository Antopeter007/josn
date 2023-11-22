import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImageWComponent } from './image-w.component';
import { TranslateModule } from '@ngx-translate/core';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
    declarations: [ImageWModule.rootComponent],
    imports: [CommonModule, TranslateModule, ReactiveFormsModule],
    exports: [ImageWModule.rootComponent]
})
export class ImageWModule {
  static rootComponent = ImageWComponent;
}
