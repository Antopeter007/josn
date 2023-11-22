import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { CommonService } from '../../services/common.service';

@Component({
  selector: 'app-widget-card-view',
  templateUrl: './widget-card-view.component.html',
  styleUrls: ['./widget-card-view.component.scss']
})
export class WidgetCardViewComponent implements OnInit {

  constructor(protected translateService: TranslateService,
    public CommonService: CommonService) { }

  @Input() visible: any;
  @Input() position: any;
  @Input() disableReturn;
  @Input() selectedRowsData: any;
  @Input() commentsRequired: any;
  @Input() commentsMandatory: any;
  @Input() remarkRequired:any;
  @Input() buttonList: any;
  @Input() bottomButtonList: any;
  @Input() pendingVerifiedTnx: any;
  @Input() verifiedTnx: any;
  @Output() handleAction: EventEmitter<any> = new EventEmitter<any>();
  charactersEnteredValue: any;
  comments: any;
  maxCommentLn=250;

  dir: string = localStorage.getItem('langDir');

  ngOnInit() {
    if (this.verifiedTnx){
      const newButtonList = [];
      if (this.buttonList?.length) {
        this.buttonList.forEach(button => {
          if (button.localizationKey === 'submit'){
            this.commentsRequired = false;
            this.commentsMandatory = false;
            newButtonList.push(button);
          }
        });
        this.buttonList = newButtonList;
      }
    } else if (this.pendingVerifiedTnx){
      const newButtonList = [];
      if (this.buttonList?.length) {
        this.buttonList.forEach(button => {
          if (button.localizationKey !== 'submit'){
            newButtonList.push(button);
          }
        });
        this.buttonList = newButtonList;
      }
    }
    if (this.buttonList?.length) {
      this.buttonList.forEach(button => {
        button.label = this.translateService.instant(button.localizationKey);
      });
    }
  }

  get charactersEntered() {
    if (this.comments) {
    this.charactersEnteredValue = this.comments.length;
    return this.charactersEnteredValue;
    } else {
      return 0;
    }
  }

  onClick(clickEvent, button, comments) {
    this.handleAction.emit({
      event: clickEvent,
      comment: comments,
      action: button.name ? button.name.replace(/\s/g, "") : button.localizationKey.replace(/\s/g, ""),
      routerLink: button.routerLink
    });
  }
  ngAfterViewChecked(): void {
  if(this.charactersEntered!== 0)
  {
  this.CommonService.scrapCommentRequired= false;
  }
  }
}
