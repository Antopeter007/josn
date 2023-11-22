import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { CommonService } from '../../services/common.service';
import { ResolverService } from '../../services/resolver.service';

@Component({
  selector: 'fcc-comment-section',
  templateUrl: './comment-section.component.html',
  styleUrls: ['./comment-section.component.scss']
})
export class CommentSectionComponent implements OnInit, OnChanges {

  constructor(protected translateService: TranslateService,
    protected resolverService: ResolverService,
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
  maxCommentLn=255;

  approveClicked = false;
  anyBtnClicked = false;
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
    this.CommonService.isMultiApproveAllowed.subscribe(
      data => {
        if (data) {
          this.approveClicked = false;
        }
      }
    );
    this.CommonService.isCommentSectionBtnEnabled.subscribe(res => {
      if(res){
        this.anyBtnClicked = false;
      }
    });
  }

  ngOnChanges(){
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
    if (button.name === 'approve') {
      this.approveClicked = !this.approveClicked;
    }
    this.resolverService.clickedCommentSectionBtn = button.actionName;
    this.anyBtnClicked = true;
    if (button.name === 'reject' && this.CommonService.isEmptyValue(comments)) {
      this.anyBtnClicked = false;
    }
    if (button.name === 'scrap' && this.CommonService.isEmptyValue(comments)) {
      this.anyBtnClicked = false;
    }
    this.handleAction.emit({
      event: clickEvent,
      comment: comments,
      action: button.name ? button.name.replace(/\s/g, "") : button.localizationKey.replace(/\s/g, ""),
      routerLink: button.routerLink
    });
  }
  ngAfterViewChecked(): void {
  if(this.charactersEntered!== 0) {
    this.CommonService.scrapCommentRequired= false;
  }
  this.resolverService.isDisableCommentSectionBtn.subscribe(val=>{
    if(val){
      this.buttonList.forEach(btn =>{
        if(btn.actionName === this.resolverService.clickedCommentSectionBtn){
          btn.disable = val;
        }
      });
    }
  });
  }
  ngOnDestroy() {
    this.resolverService.isDisableCommentSectionBtn.next(null);
  }
}
