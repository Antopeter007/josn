import { MatSelectModule } from '@angular/material/select';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatTabsModule } from '@angular/material/tabs';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CarouselViewComponent } from './carousel-view.component';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { CarouselModule } from 'primeng/carousel';
import { MatCardModule } from '@angular/material/card';

@NgModule({
    declarations: [CarouselViewModule.rootComponent],
    imports: [
        CommonModule,
        TranslateModule,
        ReactiveFormsModule,
        OverlayPanelModule,
        MatButtonModule,
        MatInputModule,
        MatFormFieldModule,
        MatIconModule,
        MatTabsModule,
        MatButtonToggleModule,
        MatTooltipModule,
        MatToolbarModule,
        MatSelectModule,
        MatCardModule,
        CarouselModule
    ],
    exports: [CarouselViewModule.rootComponent]
})
export class CarouselViewModule {
  static rootComponent = CarouselViewComponent;
}
