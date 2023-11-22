import { Component, ElementRef, Injector, Input, OnInit } from '@angular/core';
import { MatDialogConfig, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
export interface Food {
  calories: number;
  carbs: number;
  fat: number;
  name: string;
  protein: number;
}
@Component({
  selector: 'app-listdef-popup',
  templateUrl: './listdef-popup.component.html',
  styleUrls: ['./listdef-popup.component.scss']
})
export class ListdefPopupComponent implements OnInit {
  @Input() compData: string | null = null;
  private positionRelativeToElement: ElementRef;
  data: any;
  data1: any;
  left = 0;
  public dialogRef = null;
  private dialogData;
  isDialog = false;
  noOfColumnsDisplay: any;
  PeriodicElement: any;
  heading: any;
  isFirstRow: any;
  constructor(protected injector: Injector, public translate: TranslateService) {
    this.dialogRef = this.injector.get(MatDialogRef, null);
    this.dialogData = this.injector.get(MAT_DIALOG_DATA, null);
    if (this.dialogData && this.dialogRef) {
      this.positionRelativeToElement = this.dialogData.positionRelativeToElement;
      this.data = this.dialogData.dataValue;
      this.left = this.dialogData.left;
      this.noOfColumnsDisplay = this.dialogData.noOfColumns;
      this.heading = this.dialogData.heading;
      this.isFirstRow = this.dialogData.isFirstRow;

    }
   }

  ngOnInit(): void {
    document.documentElement.style.setProperty('--noOfColumns', this.noOfColumnsDisplay );
    if (this.dialogData && this.dialogRef) {
      this.isDialog = true;
      const matDialogConfig = new MatDialogConfig();
      const rect: DOMRect = this.positionRelativeToElement.nativeElement.getBoundingClientRect();
      if (this.isFirstRow){
        matDialogConfig.position = {
          left: `${this.left / 16}em`,
          top: `${(rect.bottom + 2) / 16}em`
        };
      }else{
        matDialogConfig.position = {
          left: `${this.left / 16}em`,
          top: `${(rect.bottom + 2) / 16 - 15.5}em`
        };
      }
      this.dialogRef.updatePosition(matDialogConfig.position);
    } else {
    }
  }

}
