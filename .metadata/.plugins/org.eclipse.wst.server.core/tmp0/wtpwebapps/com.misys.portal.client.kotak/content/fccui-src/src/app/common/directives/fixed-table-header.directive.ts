import { Directive, ElementRef, OnInit, HostListener, OnDestroy, Input } from '@angular/core';
import { Subscription } from 'rxjs';
import { TableService } from '../../base/services/table.service';
import { FccGlobalConstant } from '../core/fcc-global-constants';
import { AfterViewInit } from '@angular/core';
@Directive({
  selector: '[fixTableHeader]'
})
export class FixTableHeaderDirective implements OnInit, OnDestroy, AfterViewInit{
  private fixedTable: HTMLElement;
  private tableBody: HTMLElement;
  private renderTable$: Subscription;
  private tableHeaderWrapper: HTMLElement;
  @Input() isListingScreen:string;
  constructor(protected elementRef: ElementRef, protected tableService: TableService) { 
  }

  ngOnInit(): void {
    this.renderTable$ = this.tableService.tableRendered.subscribe((val) => {
        if(val && (this.isListingScreen === '/productListing' || this.isListingScreen === '/statusListing')) {
          this.init();
          this.tableBody = document.querySelector('.ui-table-scrollable-body');
          this.tableHeaderWrapper = document.querySelector('.ui-table-scrollable-header-box');
          if(this.tableBody) {
            this.tableBody.addEventListener('scroll', () => {
              this.onBodyScroll();
            });
          }
        }
    });
  }

  @HostListener('window:resize')
  onResize(): void {
    this.resizeFixed();
  }

  @HostListener('window:scroll')
  onScroll(): void {
    this.scrollFixed();
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.scrollFixed();
      this.resizeFixed();
      window.scroll(0,2);
    }, 2000);
  }

  onBodyScroll() {
    if(this.tableHeaderWrapper) {
      this.tableHeaderWrapper.style.marginLeft = '0px';
      this.fixedTable.scrollLeft = this.tableBody.scrollLeft;
    }
  }

  private init(): void {
    this.fixedTable = document.querySelector(FccGlobalConstant.TABLE_HEADER_CLASS);
    if(this.fixedTable && this.elementRef.nativeElement.querySelector(FccGlobalConstant.TABLE_HEADER_CLASS)) {
      this.elementRef.nativeElement.querySelector(FccGlobalConstant.TABLE_HEADER_CLASS).style['overflow-x'] = 'auto';
    }
    this.resizeFixed();
    this.scrollFixed();
  }

  private resizeFixed(): void {
    if(this.fixedTable) {
        this.fixedTable.style.width = this.elementRef.nativeElement.offsetWidth + 'px';
    }
  }

  private scrollFixed(): void {
    const margin = this.isListingScreen === '/statusListing' ? 115 : 0;
    const offsetY: number = window.pageYOffset || document.documentElement.scrollTop;
    const tableOffsetTop: number = this.elementRef.nativeElement.offsetTop - margin;
    const headerOffset = this.elementRef.nativeElement.querySelector(FccGlobalConstant.TABLE_HEADER_CLASS) ?
        this.elementRef.nativeElement.querySelector(FccGlobalConstant.TABLE_HEADER_CLASS).offsetHeight : 0;
    const tableOffsetBottom: number = tableOffsetTop + this.elementRef.nativeElement.offsetHeight - headerOffset;

    if(this.fixedTable) {
      this.fixedTable.style.width = this.elementRef.nativeElement.offsetWidth + 'px';
      if (offsetY < tableOffsetTop || offsetY > tableOffsetBottom) {
          this.fixedTable.style.position = 'static';
      } else if (offsetY >= tableOffsetTop && offsetY <= tableOffsetBottom) {
          this.fixedTable.style.position = 'fixed';
          this.fixedTable.style['z-index'] = '1000';
          const pTable: HTMLElement = document.querySelector('fcc-common-header > .ng-header');
          this.fixedTable.style.top = pTable.offsetHeight + 'px';
      }
      if(this.elementRef.nativeElement.querySelector(FccGlobalConstant.TABLE_HEADER_CLASS)){
        this.displayHeaderScroll();
      }
    }
  }

  displayHeaderScroll() {
    const rowList = document.querySelectorAll('.listing-table-body');
    if(rowList && rowList.length > 5) {
      this.elementRef.nativeElement.querySelector(FccGlobalConstant.TABLE_HEADER_CLASS).style['overflow-x'] = 'auto';
    } else {
      this.elementRef.nativeElement.querySelector(FccGlobalConstant.TABLE_HEADER_CLASS).style['overflow-x'] = 'none';
    }
  }

  ngOnDestroy(): void {
      this.renderTable$.unsubscribe();
  }
}
