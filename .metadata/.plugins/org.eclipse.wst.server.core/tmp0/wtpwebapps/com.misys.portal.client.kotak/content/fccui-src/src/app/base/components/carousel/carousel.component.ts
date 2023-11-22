import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Carousel } from 'primeng';
import { FccGlobalConstant } from '../../../common/core/fcc-global-constants';

import { CarouselCardParams, CarouselParams } from '../../../common/model/carousel-model';

@Component({
  selector: 'fcc-carousel',
  templateUrl: './carousel.component.html',
  styleUrls: ['./carousel.component.scss']
})
export class CarouselComponent implements OnInit {
  responsiveOptions;
  langDir: string = localStorage.getItem('langDir');
  cardParams: CarouselCardParams[];
  @Input() params: CarouselParams;
  @Output()
  cardSelectEvent: EventEmitter<any> = new EventEmitter<any>();
  @Input()
  selectedPage = 0;

  isChecked: any = false;
  cardClicked: any;
  @ViewChild('primeCarousel', {static: true, read: Carousel}) carousel: Carousel;
  constructor(protected activatedRoute: ActivatedRoute, protected translateService: TranslateService) { }

  ngOnInit(): void {
    this.responsiveOptions = [
      {
        breakpoint: '1024px',
        numVisible: 3,
        numScroll: 3
      },
      {
        breakpoint: '768px',
        numVisible: 2,
        numScroll: 2
      },
      {
        breakpoint: '560px',
        numVisible: 1,
        numScroll: 1
      }
    ];
    // setTimeout(() => {
    //   this.carousel.step('forward', this.selectedPage);
    // }, 100);

    setTimeout(() => {
      this.addAccessibilityControls();
    }, 100);
  const test = this.cardParams.splice(this.selectedPage, 1);
  this.cardParams.unshift(test[0]);
  }

  ngOnChanges() {
    this.cardParams = this.params.cardParams;
  }

  cardSelected(data: any) {
    this.cardParams.forEach(card => {
      if (card.reference === data.reference) {
        card.selected = true;
      } else {
        card.selected = false;
      }
    });
    this.cardSelectEvent.emit(data);
  }

  onChange(event: any) {
    this.isChecked = event.checked;
  }

  setDirections() {
    if (this.langDir === 'rtl') {
      return 'left';
    } else {
      return 'right';
    }
  }

  addAccessibilityControls(): void {
    const uiCarouselPrev = Array.from(document.getElementsByClassName('ui-carousel-prev'));
    const uiCarouselNext = Array.from(document.getElementsByClassName('ui-carousel-next'));
    const uiCarouselDotItems = Array.from(document.getElementsByClassName('ui-carousel-dot-item'));
    const uiCarouselDotIcons = Array.from(document.getElementsByClassName('ui-carousel-dot-icon'));

    uiCarouselPrev.forEach(element => {
      element[FccGlobalConstant.ARIA_LABEL] = this.translateService.instant("prevSlide");
      element[FccGlobalConstant.TITLE] = this.translateService.instant("prevSlide");
    });

    uiCarouselNext.forEach(element => {
      element[FccGlobalConstant.ARIA_LABEL] = this.translateService.instant("nextSlide");
      element[FccGlobalConstant.TITLE] = this.translateService.instant("nextSlide");
    });

    uiCarouselDotItems.forEach((element, index) => {
      element[FccGlobalConstant.ARIA_LABEL] = this.translateService.instant("dealSummarySlideLabel", { slideNo: index + 1 });
      element[FccGlobalConstant.TITLE] = this.translateService.instant("dealSummarySlideLabel", { slideNo: index + 1 });
    });

    uiCarouselDotIcons.forEach((element, index) => {
      element[FccGlobalConstant.ARIA_LABEL] = this.translateService.instant("dealSummarySlideLabel", { slideNo: index + 1 });
    })
  }

}
