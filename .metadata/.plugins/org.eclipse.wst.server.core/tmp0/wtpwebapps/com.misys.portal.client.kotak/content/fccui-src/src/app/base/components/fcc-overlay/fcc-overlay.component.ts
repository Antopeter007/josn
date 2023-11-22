import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng';

@Component({
  selector: 'fcc-overlay',
  templateUrl: './fcc-overlay.component.html',
  styleUrls: ['./fcc-overlay.component.scss']
})
export class FccOverlayComponent implements OnInit, OnDestroy {

  componentType: string;
  data: any;

  constructor(protected dynamicDialogConfig: DynamicDialogConfig,
    protected dialogReference: DynamicDialogRef) { }

  ngOnInit(): void {
    if (this.dynamicDialogConfig.data) {
      this.componentType = this.dynamicDialogConfig.data.componentName;
      this.data = this.dynamicDialogConfig.data;
    }
  }

  @HostListener('document:keydown.escape') onKeydownHandler() {
    this.onDialogClose();
  }

  onDialogClose() {
    if (this.dialogReference) {
      this.dialogReference.close();
      // On Close of Document Viewer Popup, the next/previous buttons were getting disabled. Hence explicitly enabling them.
      const nextButton = document.getElementById('next');
      if (nextButton) {
        nextButton['disabled'] = false;
      }
      const prevButton = document.getElementById('previous');
      if (prevButton) {
        prevButton['disabled'] = false;
      }
    }
  }

  ngOnDestroy() {
    this.onDialogClose();
  }

}
