import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HyperlinkComponent } from './hyperlink.component';
import { TranslateModule } from '@ngx-translate/core';
import { ReactiveFormsModule } from '@angular/forms';
import { OverlayPanelModule } from 'primeng';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ButtonModule } from 'primeng/button';
import { DynamicDialogModule } from 'primeng/dynamicdialog';
import { DialogModule } from 'primeng/dialog';

@NgModule({
  declarations: [HyperlinkModule.rootComponent],
  imports: [
    CommonModule,
    TranslateModule,
    ReactiveFormsModule,
    OverlayPanelModule,
    MatInputModule,
    MatFormFieldModule,
    ButtonModule,
    DynamicDialogModule,
    DialogModule
  ],
  exports: [HyperlinkModule.rootComponent],
})
export class HyperlinkModule {
  static rootComponent = HyperlinkComponent;
}
