import { Component, OnInit, Input, OnChanges, HostListener } from '@angular/core';

@Component({
  selector: 'fcc-div-banner',
  templateUrl: './div-banner.component.html',
  styleUrls: ['./div-banner.component.scss']
})
export class DivBannerComponent implements OnInit, OnChanges {
  @Input() inputParams;
  reviewDetail = [];
  lang = localStorage.getItem('language');
  innerWidth = 0;
  constructor() {
    //eslint : no-empty-function
  }

  ngOnInit(): void {
    if (this.inputParams) {
      this.reviewDetail = this.inputParams.detail;
    }
    this.innerWidth = window.innerWidth;
  }

  ngOnChanges() {
    if (this.inputParams) {
      this.reviewDetail = this.inputParams.detail;
    }
  }

  @HostListener('window:resize', [])
  handleScreenResize() {
    this.innerWidth = window.innerWidth;
  }


  borderClass(i: number): string {
    i = i + 1;

    // For items greater than 6;
    if (this.reviewDetail.length >= 6) {

      // For large screen
      if (this.innerWidth > 992) {
        if (i % 6 === 0) {
          return '';
        }
      }

      // For medium screen
      if (this.innerWidth < 992 && this.innerWidth >= 768) {
        if (i % 3 === 0) {
          return '';
        }
      }

      // For small screen
      if (this.innerWidth < 768) {
        if (i % 2 === 0) {
          return '';
        }
      }
    } else {
      // For large screen
      if (this.innerWidth > 992) {
       if (i % 4 === 0) {
         return '';
       }
     }

     // For medium screen
     if (this.innerWidth < 992 && this.innerWidth >= 768) {
       if (i % 3 === 0) {
         return '';
       }
     }

     // For small screen
     if (this.innerWidth < 768) {
       if (i % 2 === 0) {
         return '';
       }
     }
   }

    if ((this.reviewDetail.length > i) && this.lang !== 'ar') {
      return 'border-class';
    } else if ((this.reviewDetail.length > i) && this.lang === 'ar') {
      return 'border-class-left';
    } else {
      return '';
    }
  }
}
