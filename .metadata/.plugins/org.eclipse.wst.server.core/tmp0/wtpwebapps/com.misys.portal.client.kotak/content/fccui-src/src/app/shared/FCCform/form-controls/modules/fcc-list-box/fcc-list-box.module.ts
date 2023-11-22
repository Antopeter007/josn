import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FccListBoxComponent } from './fcc-list-box.component';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatListModule } from '@angular/material/list';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { ListboxModule } from 'primeng/listbox';
import { MatButtonModule } from '@angular/material/button';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';
import { NumberPaginatorDirective } from './numberPaginator.directive';


@NgModule({
  declarations: [FccListBoxModule.rootComponent,NumberPaginatorDirective],
  imports: [
      CommonModule, 
      TranslateModule,
      // MatTooltipModule,
      MatFormFieldModule,
      MatInputModule,
      MatTableModule, 
      MatPaginatorModule,
      MatIconModule,
      MatListModule,
      MatSelectModule,
      MatButtonModule,
      OverlayPanelModule,
      ListboxModule,
      FormsModule
  ],
  exports: [FccListBoxModule.rootComponent]
})
export class FccListBoxModule {
static rootComponent = FccListBoxComponent;

}
