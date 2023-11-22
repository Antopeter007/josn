import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { CommonService } from '../../services/common.service';

@Component({
  selector: 'fcc-next-button',
  templateUrl: './next-button.component.html',
  styleUrls: ['./next-button.component.scss']
})
export class NextButtonComponent implements OnInit {

  previous = '';
  next = '';
  Submit = '';
  isParentFormValid = false;
  @Input() containerType;
  @Input() items;
  @Input() isSubmitEnabled;
  @Input() submitClicked;
  @Input() buttonStyle;
  @Output()
  previousClick: EventEmitter<any> = new EventEmitter<any>();
  @Output()
  nextClick: EventEmitter<any> = new EventEmitter<any>();
  @Output()
  submitClick: EventEmitter<any> = new EventEmitter<any>();
  isNextEnabled: boolean;


  constructor(protected translateService: TranslateService, protected commonService: CommonService) { }

  ngOnInit(): void {

    this.commonService.isNextEnabled.subscribe(data =>
      {
        this.isNextEnabled= data;
      });
    this.previous = this.translateService.instant('previous');
    this.next = this.translateService.instant('next');
    this.Submit = this.translateService.instant('submit');
    this.commonService.parentFormValidCheck.subscribe((val) => {
      this.isParentFormValid = val;
    });
    this.commonService.sectionItemList.subscribe((val) => {
      this.items = val;
    });
    this.commonService.submitButtonEnable.subscribe( res => {
      this.submitClicked = !res;
    });
  }

  onClickPrevious() {
    this.previousClick.emit();
  }

  onClickNext() {
    this.nextClick.emit();
  }

  submit() {
    this.submitClick.emit();
  }
}
