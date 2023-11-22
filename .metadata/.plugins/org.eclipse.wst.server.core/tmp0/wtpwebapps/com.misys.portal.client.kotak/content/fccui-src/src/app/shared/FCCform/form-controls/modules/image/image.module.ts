import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImageComponent } from './image.component';
import { TranslateModule } from '@ngx-translate/core';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
    declarations: [ImageModule.rootComponent],
    imports: [CommonModule, TranslateModule, ReactiveFormsModule],
    exports: [ImageComponent]
})
export class ImageModule {
  static rootComponent = ImageComponent;
}
