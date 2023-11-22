import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExpansionPanelComponent } from './expansion-panel.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MatExpansionModule } from '@angular/material/expansion';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
    declarations: [ExpansionPanelModule.rootComponent],
    imports: [CommonModule, TranslateModule, ReactiveFormsModule, MatExpansionModule],
    exports: [ExpansionPanelModule.rootComponent]
})
export class ExpansionPanelModule {
  static rootComponent = ExpansionPanelComponent;

}
