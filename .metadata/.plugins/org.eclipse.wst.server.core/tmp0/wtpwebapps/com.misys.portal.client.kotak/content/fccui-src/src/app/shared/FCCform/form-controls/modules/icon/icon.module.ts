import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconComponent } from './icon.component';
import { TranslateModule } from '@ngx-translate/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@NgModule({
    declarations: [IconModule.rootComponent],
    imports: [CommonModule, MatMenuModule, TranslateModule, MatButtonModule, ReactiveFormsModule, MatIconModule],
    exports: [IconModule.rootComponent]
})
export class IconModule {
  static rootComponent = IconComponent;
}
