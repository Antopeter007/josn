import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TabComponent } from './tab.component';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { MatTabsModule } from '@angular/material/tabs';
import { TranslateModule } from '@ngx-translate/core';
import { ReactiveFormsModule } from '@angular/forms';
import { UiDynamicModule } from './../../../../../corporate/trade/ui/model/ui-dynamic/ui-dynamic.module';

@NgModule({
    declarations: [TabModule.rootComponent],
    imports: [
        CommonModule,
        TranslateModule,
        OverlayPanelModule,
        MatTabsModule,
        ReactiveFormsModule,
        UiDynamicModule,
    ],
    exports: [TabModule.rootComponent]
})
export class TabModule {
  static rootComponent = TabComponent;
}
