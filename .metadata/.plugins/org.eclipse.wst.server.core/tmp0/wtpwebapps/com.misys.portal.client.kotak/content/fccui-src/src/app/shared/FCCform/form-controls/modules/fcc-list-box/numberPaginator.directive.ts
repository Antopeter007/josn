import {
  Directive,
  Host,
  Optional,
  Renderer2,
  Self,
  ViewContainerRef,
  Input
} from "@angular/core";
import { MatPaginator } from "@angular/material/paginator";
import { FccGlobalConstant } from "../../../../../common/core/fcc-global-constants";
import { Button } from "primeng";

interface PageObject {
  length: number;
  pageIndex: number;
  pageSize: number;
  previousPageIndex: number;
}

@Directive({
  selector: "[number-paginator]"
})
export class NumberPaginatorDirective {
  private _pageGapTxt = "...";
  private _rangeStart: number;
  private _rangeEnd: number;
  private _buttons = [];
  private _curPageObj: PageObject = {
    length: 0,
    pageIndex: 0,
    pageSize: 0,
    previousPageIndex: 0
  };

  private _showTotalPages = 3;
  @Input()
  get showTotalPages(): number {
    return this._showTotalPages;
  }

  set showTotalPages(value: number) {
    this._showTotalPages = value % 2 == 0 ? value + 1 : value;
  }

  get inc(): number {
    return this._showTotalPages % 2 == 0
      ? this.showTotalPages / 2
      : (this.showTotalPages - 1) / 2;
  }

  get numOfPages(): number {
    return this.matPag.getNumberOfPages();
  }

  get lastPageIndex(): number {
    return this.matPag.getNumberOfPages() - 1;
  }

  constructor(
    @Host() @Self() @Optional() public matPag: MatPaginator,
    protected vr: ViewContainerRef,
    protected ren: Renderer2
  ) {
    //to rerender buttons on items per page change and first, last, next and prior buttons
    this.matPag.page.subscribe((e: PageObject) => {
      if (
        this._curPageObj.pageSize != e.pageSize &&
        this._curPageObj.pageIndex != 0
      ) {
        e.pageIndex = 0;
        this._rangeStart = 0;
        this._rangeEnd = this._showTotalPages - 1;
      }
      this._curPageObj = e;

      this.initPageRange();
    });
  }

  private modifyPaginatorDOM(){
    const pageSizeOption = this.vr.element.nativeElement.querySelector(
      "div.mat-paginator-page-size"
    );
    const paginatorContainer = this.vr.element.nativeElement.querySelector(
      "div.mat-paginator-container"
    );
    this.ren.removeChild(paginatorContainer,pageSizeOption);

    this.ren.appendChild(paginatorContainer,pageSizeOption);
  }

  private buildPageNumbers() {
    const actionContainer = this.vr.element.nativeElement.querySelector(
      "div.mat-paginator-range-actions"
    );
    const nextPageNode = this.vr.element.nativeElement.querySelector(
      "button.mat-paginator-navigation-next"
    );

    // remove buttons before creating new ones
    if (this._buttons.length > 0) {
      this._buttons.forEach(button => {
        this.ren.removeChild(actionContainer, button);
      });
      //Empty state array
      this._buttons.length = 0;
    }


    for (let i = 0; i < this.numOfPages; i++) {
      if (i >= this._rangeStart && i <= this._rangeEnd) {
        this.ren.insertBefore(
          actionContainer,
          this.createButton(i, this.matPag.pageIndex),
          nextPageNode
        );
      }

    }
  }

  private createButton(i: any, pageIndex: number): any {
    const linkBtn: Button = this.ren.createElement("button");
    
    if (i === pageIndex) {
      // this.ren.addClass(linkBtn, "mat-icon-button");
      this.ren.setStyle(linkBtn, "color","white");
      this.ren.setStyle(linkBtn, "background-color","#694ED6");
      this.ren.setStyle(linkBtn, 'border-radius',0);
    } 
    else {
      // this.ren.addClass(linkBtn, "mat-icon-button");
      this.ren.setStyle(linkBtn,"background-color","transparent");
    }
    this.ren.setAttribute(linkBtn,"tabindex","0");
    this.ren.setStyle(linkBtn,"border","none");
    this.ren.setStyle(linkBtn,"padding","3px 7px");

    const pagingTxt = isNaN(i) ? this._pageGapTxt : +(i + 1);
    const text = this.ren.createText(pagingTxt + "");

    this.ren.addClass(linkBtn, "mat-custom-page");
    switch (i) {
      case pageIndex:
        this.ren.setAttribute(linkBtn, "disabled", "disabled");
        break;

      default:
        this.ren.listen(linkBtn, "click", () => {
          this.switchPage(i);
        });
        this.ren.listen(linkBtn, "keyup.enter", () => {
          this.switchPage(i);
        });
        break;
    }

    this.ren.appendChild(linkBtn, text);
    //Add button to private array for state
    this._buttons.push(linkBtn);
    return linkBtn;
  }
  //calculates the button range based on class input parameters 
  //and based on current page index value. Used to render new buttons after event.
  private initPageRange(): void {
    const middleIndex = (this._rangeStart + this._rangeEnd) / 2;

    this._rangeStart = this.calcRangeStart(middleIndex);
    this._rangeEnd = this.calcRangeEnd(middleIndex);

    this.buildPageNumbers();
  }

  //Helper function To calculate start of button range
  private calcRangeStart(middleIndex: number): number {
    switch (true) {
      case this._curPageObj.pageIndex == 0 && this._rangeStart != 0:
        return 0;
      case this._curPageObj.pageIndex > this._rangeEnd:
        return this._curPageObj.pageIndex + this.inc > this.lastPageIndex
          ? this.lastPageIndex - this.inc * 2
          : this._curPageObj.pageIndex - this.inc;
      case this._curPageObj.pageIndex > this._curPageObj.previousPageIndex &&
        this._curPageObj.pageIndex > middleIndex &&
        this._rangeEnd < this.lastPageIndex:
        return this._rangeStart + 1;
      case this._curPageObj.pageIndex < this._curPageObj.previousPageIndex &&
        this._curPageObj.pageIndex < middleIndex &&
        this._rangeStart > 0:
        return this._rangeStart - 1;
      case this._curPageObj.pageIndex < this._rangeStart || 
      this._curPageObj.pageIndex >= this.lastPageIndex:
        return this.lastPageIndex - this.inc * 2;
      default:
        return this._rangeStart;
    }
  }
  //Helpter function to calculate end of button range
  private calcRangeEnd(middleIndex: number): number {
    switch (true) {
      case this._curPageObj.pageIndex == 0 &&
        this._rangeEnd != this._showTotalPages:
        return this._showTotalPages - 1;
      case this._curPageObj.pageIndex > this._rangeEnd:
        return this._curPageObj.pageIndex + this.inc > this.lastPageIndex
          ? this.lastPageIndex
          : this._curPageObj.pageIndex + 1;
      case this._curPageObj.pageIndex > this._curPageObj.previousPageIndex &&
        this._curPageObj.pageIndex > middleIndex &&
        this._rangeEnd < this.lastPageIndex:
        return this._rangeEnd + 1;
      case this._curPageObj.pageIndex < this._curPageObj.previousPageIndex &&
        this._curPageObj.pageIndex < middleIndex &&
        this._rangeStart >= 0 &&
        this._rangeEnd > this._showTotalPages - 1:
        return this._rangeEnd - 1;
      case this._curPageObj.pageIndex < this._rangeStart || 
        this._curPageObj.pageIndex >= this.lastPageIndex:
          return this.lastPageIndex;
      default:
        return this._rangeEnd;
    }
  }
  //Helper function to switch page on non first, last, next and previous buttons only.
  private switchPage(i: number): void {
    const previousPageIndex = this.matPag.pageIndex;
    this.matPag.pageIndex = i;
    this.matPag["_emitPageEvent"](previousPageIndex);
    this.initPageRange();
  }
  //Initialize default state after view init
  public ngAfterViewInit() {
    this._rangeStart = 0;
    this._rangeEnd = this._showTotalPages - 1;
    this.modifyPaginatorDOM();
    setTimeout(() => {
      this.initPageRange();
    }, FccGlobalConstant.LENGTH_2000);
  }
}
