
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { AfterViewInit, Component, ElementRef, Inject, OnInit, QueryList, ViewChildren } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { FccGlobalConstant } from '../../core/fcc-global-constants';
import { ListDefService } from '../../services/listdef.service';
import {
  DOWN_ARROW,
  UP_ARROW
} from "@angular/cdk/keycodes";

@Component({
  selector: 'app-column-customization',
  templateUrl: './column-customization.component.html',
  styleUrls: ['./column-customization.component.scss']
})
export class ColumnCustomizationComponent implements OnInit, AfterViewInit {

  dir: string = localStorage.getItem('langDir');
   allowColumnCustomization: boolean;
   frozenColMaxLimit: any;
   currentFrozenColLimit = 0;
   isFrozenColMaxLimitReached = false;
   isSelectColMinLimitReached = false;
   isSelectAll = true;
   columnList: any [];
   listdefLastFreezedColumnIndex;
   overlayLastFreezedColumnIndex;
   scrollable = false;
  staticTextSelectObj: any = {};
  staticTextFrozenObj: any = {};
  selectValidationmessage: any;
  freezeValidationmessage: any;
  columns: any[] = [];
  isFrench = false;
  activeItem: number;
  @ViewChildren("listItem") listItems: QueryList<ElementRef>;

  constructor( @Inject(MAT_DIALOG_DATA) private data: any, //eslint-disable-line @typescript-eslint/no-parameter-properties
      public translate: TranslateService, //eslint-disable-line @typescript-eslint/no-parameter-properties
               protected listService: ListDefService, //eslint-disable-line @typescript-eslint/no-parameter-properties
  private dialogRef: MatDialogRef<ColumnCustomizationComponent>, ){ } //eslint-disable-line @typescript-eslint/no-parameter-properties

  ngOnInit(): void {
    this.loadTableColumns(this.data.event);
    const language = localStorage.getItem('language');
    if (language === 'fr') {
      this.isFrench = true;
    }else{
      this.isFrench = false;
    }
  }

  ngAfterViewInit() {
    this.listItems.changes.subscribe(()=> {
      this.setFocus();
    });
  }

  setFocus() {
    if (this.listItems && this.listItems.toArray() && this.listItems.toArray()[this.activeItem]){
      this.listItems.toArray()[this.activeItem].nativeElement.focus();
    }
  }


  OnEnterKey(event, inx, val) {
    if (event.code === 'Enter') {
      this.onLockClick(inx, val);
    }
  }
// eslint-disable-next-line @typescript-eslint/no-unused-vars
loadTableColumns(event) {
  this.columnList = JSON.parse(JSON.stringify(this.data.dataValue));
  this.frozenColMaxLimit = this.data.frozenColMaxLimit;
  this.setLastFreezedColumnListIndex();
  this.isFrozenColMaxLimitReached = false;
  this.isSelectColMinLimitReached = false;
  this.createStaticTextObj();
  if (this.columnList.filter(col => col.showAsDefault).length === this.columnList.length) {
    this.isSelectAll = true;
  } else {
    this.isSelectAll = false;
  }
}

  onSelectAll() {
    this.isSelectAll = !this.isSelectAll;
    if (!this.columnList) {
        return;
    }
    let selectedCount = 0;
    this.columnList.forEach(col => {
      if (!col.frozen) {
        col.showAsDefault = this.isSelectAll;
      }
      if (col.showAsDefault) {
        selectedCount++;
      }
    });
    if (selectedCount < FccGlobalConstant.LENGTH_3) {
      this.isSelectColMinLimitReached = true;
    } else {
      this.isSelectColMinLimitReached = false;
    }
  }



  setCurrentFrozenColLimit() {
    this.currentFrozenColLimit = this.columnList.filter(col => col.frozen).length;
  }


  drop(event: CdkDragDrop<string[]>) {
    if ((this.columnList[event.previousIndex].frozen && this.columnList[event.currentIndex].frozen) ||
        (!this.columnList[event.previousIndex].frozen && !this.columnList[event.currentIndex].frozen)) {
      moveItemInArray(this.columnList, event.previousIndex, event.currentIndex);
      this.columnList = JSON.parse(JSON.stringify(this.columnList));
      this.setLastFreezedColumnListIndex();
    }
  }
  handleKeyDown(event, currentIndex: number) {
    let newIndex = currentIndex;
    if (event && event.keyCode === DOWN_ARROW) {
      newIndex += 1;
    }
    if (event && event.keyCode === UP_ARROW) {
      newIndex -= 1;
    }
    if (this.columnList && this.columnList[newIndex] && !this.columnList[newIndex].frozen){
      moveItemInArray(this.columnList, currentIndex, newIndex);
      this.columnList = JSON.parse(JSON.stringify(this.columnList));
      this.setLastFreezedColumnListIndex();
      this.activeItem = newIndex;
      this.setFocus();
    }
  }



onSelectColumn(event, index) {
  if (event) {
    this.isSelectAll = this.columnList.filter((t, i) => t.showAsDefault && i !== index).length === this.columnList.length - 1;
  } else {
    this.isSelectAll = false;
  }
  this.validateSelectedColMinLimit(event, index);
}

validateSelectedColMinLimit(event, index) {
  if (this.columnList.filter((col, i) => (i !== index && col.showAsDefault && col.field !== FccGlobalConstant.ACTION) ||
  (i === index && event)).length < FccGlobalConstant.LENGTH_3) {
    this.isSelectColMinLimitReached = true;
  } else {
    this.isSelectColMinLimitReached = false;
  }
}


setLastFreezedColumnIndex() {
  if (this.columns && this.columns.length) {
    for (let index = 0; index < this.columns.length; index++) {
      if (!this.columns[index].frozen) {
        this.listdefLastFreezedColumnIndex = index < 0 ? null : index - 1;
        break;
      }
    }
  }
}


setLastFreezedColumnListIndex() {
  if (this.columnList && this.columnList.length) {
    for (let index = 0; index < this.columnList.length; index++) {
      if (!this.columnList[index].frozen) {
        this.overlayLastFreezedColumnIndex = index < 0 ? null : index - 1;
        break;
      }
    }
  }
}


onLockClick(index, action) {
  this.setCurrentFrozenColLimit();
  if ((this.currentFrozenColLimit < this.frozenColMaxLimit) ||
  (this.currentFrozenColLimit === this.frozenColMaxLimit && action === 'unfreeze')) {
    this.columnList[index].frozen = !this.columnList[index].frozen;
    this.columnList[index].showAsDefault = this.columnList[index].frozen ? true : this.columnList[index].showAsDefault;
    const colList = [...this.columnList.filter(col => col.frozen), ...this.columnList.filter(col => !col.frozen)];
    this.columnList = JSON.parse(JSON.stringify(colList));
    this.setLastFreezedColumnListIndex();
    this.isFrozenColMaxLimitReached = false;
    this.validateSelectedColMinLimit(true, index);
  } else {
    this.isFrozenColMaxLimitReached = true;
    this.staticTextFrozenObj[FccGlobalConstant.STATIC_TEXT_MESSAGE] = this.freezeValidationmessage;
  }
}

onCancel() {
  this.dialogRef.close();
}


onApply() {
  this.dialogRef.close(this.columnList);
}

setScrollable() {
  if (this.columns && this.columns.length) {
    this.columns.forEach(col => {
      if (col.width && col.width.indexOf(FccGlobalConstant.PERCENT) > -1) {
        col.width = col.width.replace(FccGlobalConstant.PERCENT, FccGlobalConstant.EM);
      }
    });
    this.scrollable = true;
  } else {
    this.scrollable = false;
  }
}


  someSelected() {
    if (!this.columnList) {
      return false;
    }
    const selectedColCount = this.columnList.filter(t => t.showAsDefault).length;
    return selectedColCount < this.columnList.length && selectedColCount !== 0;
  }

  setDirections(purpose: string, value: string): string {
    switch (purpose) {
      case 'className':
        return this.dir === 'rtl' ? 'ui-rtl' : 'none';
      case 'direction':
        return this.dir === 'rtl' ? 'left' : 'right';
      case 'paginatorDirection':
        return this.dir === 'rtl' ? (value === 'left' ? 'paginatorright' : 'paginatorleft') :
        (value === 'left' ? 'paginatorleft' : 'paginatorright');
      case 'colDirection':
        return this.dir === 'rtl' ? (value === 'left' ? 'right' : 'left') : value;
    }
  }

  createStaticTextObj() {
    this.selectValidationmessage = `${this.translate.instant(FccGlobalConstant.MINIMUM_COLUMNS_SELECTED)}`;
    this.freezeValidationmessage = `${this.translate.instant(FccGlobalConstant.MAXIMUM_COLUMNS_FROZEN,
      { frozenColumns: this.frozenColMaxLimit })}`;
    this.staticTextSelectObj[FccGlobalConstant.STATIC_TEXT_MESSAGE] = this.selectValidationmessage;
    this.staticTextSelectObj[FccGlobalConstant.FONT_SIZE] = FccGlobalConstant.ZERO_DOT_EIGHTY_FIVE_EM;
    this.staticTextSelectObj[FccGlobalConstant.FONT_COLOR] = FccGlobalConstant.ERROR_MESSAGE_COLOR;
    this.staticTextSelectObj[FccGlobalConstant.POSITION] = FccGlobalConstant.RELATIVE_POSITION;
    this.staticTextSelectObj[FccGlobalConstant.WIDTH] = FccGlobalConstant.AUTO_WIDTH;
    this.staticTextFrozenObj = JSON.parse(JSON.stringify(this.staticTextSelectObj));
    this.staticTextFrozenObj[FccGlobalConstant.STATIC_TEXT_MESSAGE] = this.freezeValidationmessage;
  }

}

