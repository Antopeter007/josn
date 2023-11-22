import { CommonService } from './../../../services/common.service';
import { OPEN_CLOSE_ANIMATION } from '../../../model/animation';
import { Component, OnInit } from '@angular/core';
import { DashboardService } from '../../../services/dashboard.service';
import { Router, ActivatedRoute } from '@angular/router';
import { SessionValidateService } from '../../../services/session-validate-service';
import { FccGlobalConstant } from '../../../../common/core/fcc-global-constants';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'fcc-news-parent',
  templateUrl: './fcc-news-parent.component.html',
  styleUrls: ['./fcc-news-parent.component.scss'],
  animations: [OPEN_CLOSE_ANIMATION]
})
export class FccNewsParentComponent implements OnInit {

  constructor(protected router: Router,
              protected route: ActivatedRoute,
              protected dashboardService: DashboardService,
              protected sessionValidation: SessionValidateService,
              protected commonService: CommonService,
              protected translateService: TranslateService) {

  }

  newtype: string;
  newObject;
  externalObject;
  DispalyType: string;
  ButtonType: string;
  start;
  count;
  nonewsexternal = true;
  nonewsinternal = true;
  externalNewsPermission = false;
  internalNewsPermission = false;
  syndicatedNews: any[] = [];
  currentListOfNews: any[] = [];
  fullInternalList: any[] = [];
  fullExternalList: any[] = [];
  newsTitleName: string = null;
  menuToggleFlag;
  lengthZero = FccGlobalConstant.LENGTH_0;

  onChangeOfNews() {
    if (this.ButtonType === `${this.translateService.instant('newsExternal')}`) {
      this.DispalyType = `${this.translateService.instant('newsExternalHyhen')}`;
      this.ButtonType = `${this.translateService.instant('newsInternal')}`;
      this.newtype = 'external';
      this.getExternalNews();
    } else {
      this.DispalyType = `${this.translateService.instant('newsInternalHyhen')}`;
      this.ButtonType = `${this.translateService.instant('newsExternal')}`;
      this.newtype = 'internal';
      this.getInternalNews();
    }
  }

  disableButton(): boolean {
    this.commonService.getUserPermission(FccGlobalConstant.GLOBAL_NEWS_PORTLET_ACCESS).subscribe(result => {
      if (result) {
      this.externalNewsPermission = true;
      }
    });
    this.commonService.getUserPermission(FccGlobalConstant.INTERNAL_NEWS_PORTLET_ACCESS).subscribe(result => {
      if (result) {
      this.internalNewsPermission = true;
      }
    });
    if (this.internalNewsPermission === true && this.externalNewsPermission === true) {
      return true;
    }
    else {
      return false;
    }
  }

  getInternalNews() {
    this.newObject = {
      image: this.fullInternalList[0].image,
      desc: this.fullInternalList[0].desc.toString().replace(/<[^>]*>/g, ''),
      title: this.fullInternalList[0].title,
      attachment: this.fullInternalList[0].attachment,
    };
    this.currentListOfNews = this.fullInternalList;
  }
  updateNews(data: any) {

    this.newObject = {
      image: data.channel_record.topics.topic[0].img_file_id,
      desc: data.news_record[0].description.toString().replace(/<[^>]*>/g, ''),
      title: data.news_record[0].title,
      titleLink: data.syndicatedNews[0].titleLink,

    };
  }

  getExternalNews() {

    this.newObject = {
      image: this.fullExternalList[0].image,
      desc: this.fullExternalList[0].desc.toString().replace(/<[^>]*>/g, ''),
      title: this.fullExternalList[0].title,
    };
    this.currentListOfNews = this.fullExternalList;
  }

  updateSyndicatedNews(data) {
    this.newObject = {
      image: data.syndicatedNews[0].image,
      desc: data.syndicatedNews[0].newsDescription,
      title: data.syndicatedNews[0].newsTitle,
      newsLink: data.syndicatedNews[0].newsLink,
      imageLink: data.syndicatedNews[0].imageLink,
    };
  }


  ngOnInit() {
    this.gotoTop();
    this.commonService.getMenuValue().subscribe((value) => {
      this.menuToggleFlag = value;
    });
    this.newtype = this.route.snapshot.params.Newstype;
    this.newObject = JSON.parse(this.route.snapshot.params.NewsOject);
    this.fullInternalList = JSON.parse(this.route.snapshot.params.FullInternalList);
    this.fullExternalList = JSON.parse(this.route.snapshot.params.FullExternalList);
    if (this.newObject === '') {
      if (this.newtype === 'internal') {
        this.newObject = {
          image: this.fullInternalList[0].image,
          desc: this.fullInternalList[0].desc.toString().replace(/<[^>]*>/g, ''),
          title: this.fullInternalList[0].title,
          titleLink: this.fullInternalList[0].titleLink
        };
      } else {
        this.newObject = {
          image: this.fullExternalList[0].image,
          desc: this.fullExternalList[0].desc.toString().replace(/<[^>]*>/g, ''),
          title: this.fullExternalList[0].title,
          titleLink: this.fullInternalList[0].titleLink
        };
      }
    }
    this.changeNewType();
  }

  gotoTop() {
    window.scroll({
      top: this.lengthZero
    });
  }

  newsDescription($event: string) {
    this.newsTitleName = $event;
    if (this.newtype === 'internal') {
      this.fullInternalList.forEach(element => {
        if (element.itemId === this.newsTitleName) {
          this.newObject = {
            image: element.image,
            completeDesc: element.completeDesc,
            desc: element.desc,
            title: element.title,
            titleLink: element.titleLink,
            attachment: element.attachment
          };
        }
      });

    } else {
      this.fullExternalList.forEach(element => {
        if (element.itemId === this.newsTitleName) {
          this.newObject = {
            image: element.image,
            desc: element.desc,
            title: element.title,
            titleLink: element.titleLink
          };
        }
      });
    }
  }

  changeNewType() {
    if (this.newtype === 'internal') {
      this.currentListOfNews = this.fullInternalList;
      this.DispalyType = `${this.translateService.instant('newsInternalHyhen')}`;
      this.ButtonType = `${this.translateService.instant('newsExternal')}`;
    } else {
      this.currentListOfNews = this.fullExternalList;
      this.DispalyType = `${this.translateService.instant('newsExternalHyhen')}`;
      this.ButtonType = `${this.translateService.instant('newsInternal')}`;
    }
  }

}
