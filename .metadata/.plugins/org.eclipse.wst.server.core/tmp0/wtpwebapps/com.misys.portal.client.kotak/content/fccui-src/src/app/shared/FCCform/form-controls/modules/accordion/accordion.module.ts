import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccordionComponent } from './accordion.component';
import { MatExpansionModule } from '@angular/material/expansion';
import { TableModule } from 'primeng/table';
import { MatCardModule } from '@angular/material/card';
import { DropdownModule } from 'primeng/dropdown';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { FccCommonModule } from './../../../../../common/fcc-common.module';
import { MessageModule } from 'primeng';
import { FCCPurchaseOrderViewPreviewModule } from '../purchase-order-view-preview/purchase-order-view-preview.module';

@NgModule({
  declarations: [AccordionModule.rootComponent],
  imports: [
    CommonModule,
    TranslateModule,
    ReactiveFormsModule,
    MatExpansionModule,
    TableModule,
    MatCardModule,
    DropdownModule,
    MatTooltipModule,
    MessageModule,
    FormsModule,
    MatIconModule,
    MatMenuModule,
    FccCommonModule,
    FCCPurchaseOrderViewPreviewModule
  ],
  entryComponents: [AccordionModule.rootComponent],
  exports: [AccordionModule.rootComponent],
})
export class AccordionModule {
  static rootComponent = AccordionComponent;

}
