
import { FccGlobalConstant } from './../../../core/fcc-global-constants';
import { CommonService } from './../../../services/common.service';
import { OPEN_CLOSE_ANIMATION } from './../../../model/animation';
import { HideShowDeleteWidgetsService } from './../../../services/hide-show-delete-widgets.service';
import { FccGlobalConstantService } from './../../../core/fcc-global-constant.service';
import { AfterViewChecked, Component, ElementRef, HostListener, Input, OnInit } from '@angular/core';
import { DashboardService } from '../../../services/dashboard.service';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { SessionValidateService } from '../../../services/session-validate-service';
import { FccGlobalConfiguration } from '../../../core/fcc-global-configuration';
import { TranslateService } from '@ngx-translate/core';
import { GlobalDashboardComponent } from './../../../components/global-dashboard/global-dashboard.component';
import { EscapeHtmlPipe } from './../../../pipes/keep-html.pipe';
import { CustomSlicePipe } from '../../../pipes/custom-slice.pipe';

@Component({
  selector: 'fcc-common-news',
  templateUrl: './fcc-news.component.html',
  styleUrls: ['./fcc-news.component.scss'],
  animations: [OPEN_CLOSE_ANIMATION]
})
export class FccNewsComponent implements OnInit, AfterViewChecked {
  syndicatedNews: any[] = [];
  internalnews: any[] = [];
  contextPath: any;
  newsPresentInternal = true;
  newsPresentExternal = true;
  internalNewsPermission = false;
  externalNewsPermission = false;
  hiddendivInternal = true;
  hiddendivExternal = true;
  configuredKeysList = 'PAGINATION_START,NEWS_RECORD_DISPLAY';
  keysNotFoundList: any[] = [];
  start;
  count;
  newsrecord: any[];
  channelrecord: any[];
  checkCustomise;
  hideShowCard;
  classCheck;
  showDialog;
  newsLink;
  title = 'fccNewsComponent';
  newsAttachment: any[] = [];
  readmore;
  responsiveOptions;
  dojoUrl;
  dir: string = localStorage.getItem('langDir');
  dojoHome = true;

  firstItem: any;
  lastItem: any;
  @Input() widgetDetails;
  nudges: any;
  isAccessibilityControlAdded = false;
  constructor(
    protected route: ActivatedRoute,
    protected router: Router,
    protected hideShowDeleteWidgetsService: HideShowDeleteWidgetsService,
    protected fccGlobalConstantService: FccGlobalConstantService,
    protected dashboardService: DashboardService,
    protected globalDashboardComponent: GlobalDashboardComponent,
    protected http: HttpClient,
    protected sessionValidation: SessionValidateService,
    protected escapeHtmlPipe: EscapeHtmlPipe,
    protected commonService: CommonService,
    protected fccGlobalConfiguration: FccGlobalConfiguration,
    protected translateService: TranslateService,
    protected customSlicePipe: CustomSlicePipe,
    protected tref: ElementRef
  ) { }

  ngOnInit() {
    this.commonService.getNudges(this.widgetDetails).then(data => {
      this.nudges = data;
    });
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
    this.contextPath = this.fccGlobalConstantService.contextPath;
    this.keysNotFoundList = this.fccGlobalConfiguration.configurationValuesCheck(this.configuredKeysList);
    if (this.keysNotFoundList.length !== 0) {
      this.commonService
        .getConfiguredValues(this.keysNotFoundList.toString())
        .subscribe(response => {
          if (response.response && response.response === 'REST_API_SUCCESS') {
            this.fccGlobalConfiguration.addConfigurationValues(
              response,
              this.keysNotFoundList
            );
            this.updateValues();
          }
        });
    } else {
      this.updateValues();
    }
  }

  ngAfterViewChecked(): void {
    if(!this.isAccessibilityControlAdded) {
      this.addAccessibilityControls();
    }
  }

  addAccessibilityControls(): void {
    const uiCarouselPrev = Array.from(document.getElementsByClassName('ui-carousel-prev'));
    const uiCarouselNext = Array.from(document.getElementsByClassName('ui-carousel-next'));
    const uiCarouselDotItems = Array.from(document.getElementsByClassName('ui-carousel-dot-item'));

    if (uiCarouselPrev.length > 0 &&
      uiCarouselNext.length > 0 &&
      uiCarouselDotItems.length > 0) {

      this.isAccessibilityControlAdded = true;

      uiCarouselPrev.forEach(element => {
        element[FccGlobalConstant.ARIA_LABEL] = this.translateService.instant("prevSlide");
        element[FccGlobalConstant.TITLE] = this.translateService.instant("prevSlide");
      });

      uiCarouselNext.forEach(element => {
        element[FccGlobalConstant.ARIA_LABEL] = this.translateService.instant("nextSlide");
        element[FccGlobalConstant.TITLE] = this.translateService.instant("nextSlide");
      });

      uiCarouselDotItems.forEach((element, index) => {
        element[FccGlobalConstant.ARIA_LABEL] = this.translateService.instant("newsSummarySlideLabel", { slideNo: index + 1 });
        element[FccGlobalConstant.TITLE] = this.translateService.instant("newsSummarySlideLabel", { slideNo: index + 1 });
      });
    }
  }

  moreNews(newstype) {
    this.detailedNews(newstype, '');
  }

  detailedNews(newstype, newsOject) {

    const newsData = {
      Newstype: newstype,
      NewsOject: JSON.stringify(newsOject),
      FullInternalList: JSON.stringify(this.internalnews),
      FullExternalList: JSON.stringify(this.syndicatedNews)
    };
    this.router.navigate(['newnews', newsData], { skipLocationChange: true });
  }

  deleteCards() {
    this.hideShowDeleteWidgetsService.fccNewsCardHideShow.next(true);
    this.hideShowDeleteWidgetsService.fccNewsCardHideShow.subscribe(res => {
      this.hideShowCard = res;
    });
    setTimeout(() => {
      this.hideShowDeleteWidgetsService.getSmallWidgetActions(JSON.parse(this.widgetDetails).widgetName,
      JSON.parse(this.widgetDetails).widgetPosition);
      this.globalDashboardComponent.deleteCardLayout(JSON.parse(this.widgetDetails).widgetName);
    } , FccGlobalConstant.DELETE_TIMER_INTERVAL);
  }

  updateValues() {
    this.start = FccGlobalConfiguration.configurationValues.get('PAGINATION_START');
    this.count = FccGlobalConfiguration.configurationValues.get('NEWS_RECORD_DISPLAY');
    this.getNews();
  }

  getNews() {
  this.commonService.getUserPermission(FccGlobalConstant.GLOBAL_NEWS_PORTLET_ACCESS).subscribe(result => {
    if (result) {
      this.externalNewsPermission = true;
      this.dashboardService
      .getExternalNews(this.start, this.count)
      .subscribe(
        data => {
          if (data.errorMessage && data.errorMessage === 'SESSION_INVALID') {
            this.sessionValidation.IsSessionValid();
          } else if (data.errorMessage && data.errorMessage === 'NO_RECORD_FOUND') {
            this.newsPresentExternal = false;
          } else if (
            data.response &&
            data.response === 'REST_API_SUCCESS' &&
            data.numOfNews > 0
          ) {
            this.updateSyndicatedNews(data);
            const parentele = this.tref.nativeElement;
            const prevchildEle = parentele.getElementsByClassName('ui-carousel-prev');
            const nextchildEle = parentele.getElementsByClassName('ui-carousel-next');
            if (data.numOfNews <= 3){
              if (prevchildEle && prevchildEle.length > 0) {
                prevchildEle[0].setAttribute('style', 'visibility: hidden;');
              }
              if (nextchildEle && nextchildEle.length > 0) {
                nextchildEle[0].setAttribute('style', 'visibility: hidden;');
              }
            }
            if (prevchildEle && prevchildEle.length > 0) {
              prevchildEle[0].setAttribute('aria-label', 'Previous News'); 
            }
            if (nextchildEle && nextchildEle.length > 0) {
              nextchildEle[0].setAttribute('aria-label', 'Next News');
            }
          } else {
            this.newsPresentExternal = false;
          }
        },
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        error => {
          this.newsPresentExternal = false;
        }
      );
    } else {
      this.newsPresentExternal = false;
    }
    this.updateCustomise();
    this.updateInternalNews();
  });
  }

  updateCustomise() {
    this.hideShowDeleteWidgetsService.customiseSubject.subscribe(data => {
      this.checkCustomise = data;
    });
    this.commonService.dashboardOptionsSubject.subscribe(data => {
      this.classCheck = data;
    });
  }

  updateInternalNews() {
    this.commonService.getUserPermission(FccGlobalConstant.INTERNAL_NEWS_PORTLET_ACCESS).subscribe(result => {
      if (result) {
        this.internalNewsPermission = true;
        this.dashboardService
      .getInternalNews(this.start, this.count)
      .subscribe(
        data => {
          if (data.errorMessage && data.errorMessage === 'SESSION_INVALID') {
            this.sessionValidation.IsSessionValid();
          } else if (
            data.response &&
            data.response === 'REST_API_SUCCESS' &&
            data.numNewsItems > 0
          ) {
            if (data.numNewsItems > 1) {
              this.hiddendivInternal = false;
            }
            this.newsrecord = data.news_record;
            this.channelrecord = data.channel_record.topics.topic;
            this.updateNews(data);
          } else {
            this.newsPresentInternal = false;
          }
        },
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        error => {
          this.newsPresentInternal = false;
        }
      );
      } else {
        this.newsPresentInternal = false;
      }
    });
  }
  updateNews(data) {
    for (let i = 0; i < data.news_record.length; i++) {
      for (
        let j = 0;
        j < data.channel_record.topics.topic.length;
        j++
      ) {
        if (
          data.news_record[i].topic_id ===
          data.channel_record.topics.topic[j].topic_id
        ) {
          this.newsAttachment = [];
          for (let k = 0; k < data.news_record[i].attachments.attachment[0].length; k++) {
            this.newsAttachment.push({
              attachmentId: data.news_record[i].attachments.attachment[0][k].attachment_id,
              attachmentTitle: data.news_record[i].attachments.attachment[0][k].title,
              fileName: data.news_record[i].attachments.attachment[0][k].file_name
            });
          }
          this.internalnews.push({
            title: data.news_record[i].title,
            titleLink: data.news_record[i].link,
            completeDesc: data.news_record[i].description.toString(),
            desc: data.news_record[i].description.toString().replace(/<[^>]*>/g, ''),
            index: true,
            image: data.channel_record.topics.topic[j].img_file_id,
            imageLink: data.channel_record.topics.topic[j].link,
            attachment: this.newsAttachment,
            itemId: data.news_record[i].item_id,
          });
        }
      }
    }
    this.moreInternalNews(data);
  }
  moreInternalNews(data) {
    if (data.numNewsItems > this.count) {
      this.internalnews.push({
        title: `${this.translateService.instant('moreNews')}`,
        titleLink: '',
        desc: `${this.translateService.instant('moreNewsLink')}`,
        index: false,
        image: '',
        imageLink: ''
      });
    }
  }

  updateSyndicatedNews(data) {
    if (data.numOfNews > 1) {
      this.hiddendivExternal = false;
    }
    for (let i = 0; i < data.syndicatedNews.length; i++) {
      this.syndicatedNews.push({
        image: data.syndicatedNews[i].image,
        desc: data.syndicatedNews[i].newsDescription,
        title: data.syndicatedNews[i].newsTitle,
        titleLink: data.syndicatedNews[i].newsLink,
        imageLink: data.syndicatedNews[i].imageLink,
        index: true,
        itemId: i
      });
    }

    this.firstItem = this.syndicatedNews[0].itemId;
    this.lastItem = this.syndicatedNews[this.syndicatedNews.length - 1].itemId;

    if (data.numOfNews > this.count) {

      this.syndicatedNews.push({
        title: `${this.translateService.instant('moreNews')}`,
        desc: `${this.translateService.instant('moreNewsLink')}`,
        index: false,
        newsLink: '',
        imageLink: '',
        image: ''
      });
    }
  }

  showPopUp(url) {
    this.newsLink = url;
    this.showDialog = true;
  }
  closeDialog() {
    this.showDialog = false;
  }

  @HostListener('window:keyup', ['$event'])
  checkForLastNdFirstCard(event: KeyboardEvent) {
    if (event.key === 'Tab') {
      const firstCard = document.getElementById('extrnws_' + this.firstItem);
      const lastCard = document.getElementById('extrnws_' + this.lastItem);

      const isFirstCardFocused = document.activeElement === firstCard;
      const isLastCardFocused = document.activeElement === lastCard;

      const carouselNext = document.getElementsByClassName('ui-carousel-next');
      const carouselPrev = document.getElementsByClassName('ui-carousel-prev');

      if (isFirstCardFocused) {
        carouselPrev[0].setAttribute('style', 'visibility: hidden');
      } else {
        carouselPrev[0].setAttribute('style', 'visibility: visible');
      }

      if (isLastCardFocused) {
        carouselNext[0].setAttribute('style', 'visibility: hidden');
      } else {
        carouselNext[0].setAttribute('style', 'visibility: visible');
      }
    }
  }
}
