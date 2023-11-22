import { Component, Input, ChangeDetectorRef } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { UntypedFormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { CommonService } from './../../services/common.service';
import { UserFeedbackService } from '../../services/feedback-service';
import { FeedbackRequest } from '../../model/feedback-request';
import { FccGlobalConstantService } from './../../core/fcc-global-constant.service';
import { FccGlobalConstant } from '../../core/fcc-global-constants';
import { FccConstants } from '../../core/fcc-constants';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-feedback',
  templateUrl: './feedback.component.html',
  styleUrls: ['./feedback.component.scss']
})
export class FeedbackComponent {

  feedbackForm: UntypedFormGroup;
  subscriptions: Subscription[] = [];
  dir: string = localStorage.getItem(FccGlobalConstant.LANG_DIR);
  starRatingSize;
  feedbackCharLength;
  rating = 0;
  feedbackRequest: FeedbackRequest = new FeedbackRequest();
  @Input() isFeedbackRequired: boolean;
  @Input() inputParams;
  productCode: string;
  subProductCode: string;
  tnxTypeCode: string;
  isfeedbackSubmitted: boolean;
  invalidFeedback: boolean;
  charactersEnteredValue;

  constructor(protected translate: TranslateService, protected formBuilder: UntypedFormBuilder,
    protected commonService: CommonService, protected cdr: ChangeDetectorRef,
    protected userFeedbackService: UserFeedbackService,
    protected fccGlobalConstantService: FccGlobalConstantService) {

  }

  ngOnInit() {
    const starrating = 5;
    const feedbackcharlength = 6500;
    this.starRatingSize = this.commonService.getStarRatingSize() !== undefined ? this.commonService.getStarRatingSize() : starrating;
    this.feedbackCharLength = this.commonService.getfeedbackCharLength() !== undefined ?
    this.commonService.getfeedbackCharLength() : feedbackcharlength;
    if (this.inputParams && this.inputParams.productCode) {
      this.productCode = this.inputParams.productCode;
      this.subProductCode = this.inputParams.subProductCode;
      this.tnxTypeCode = this.inputParams.tnxTypeCode;
    } else {
      this.productCode = this.commonService.getQueryParametersFromKey(FccGlobalConstant.PRODUCT);
      this.subProductCode = this.commonService.getQueryParametersFromKey(FccGlobalConstant.SUB_PRODUCT_CODE);
      this.tnxTypeCode = this.commonService.getQueryParametersFromKey(FccGlobalConstant.TNX_TYPE_CODE);
    }
    this.feedbackForm = this.formBuilder.group({
      date_time:  '',
      feedback: ['', Validators.maxLength(this.feedbackCharLength)],
      rating: 0,
      location: ''
    });
  }

  getDate(): string {
    const currentdate = new Date();
    return currentdate.toISOString();
  }

  onSubmit() {
    this.feedbackRequest.feedbackTime = this.getDate();
    this.feedbackRequest.feedback = this.feedbackForm.get(FccConstants.FEEDBACK).value;
    this.feedbackRequest.rating = this.rating;
    this.feedbackRequest.productCode = this.productCode;
    this.feedbackRequest.subProductCode = this.subProductCode ? this.subProductCode : FccConstants.DEFAULT_CRITERIA;
    this.feedbackRequest.tnxTypeCode = this.tnxTypeCode ? this.tnxTypeCode : FccConstants.DEFAULT_CRITERIA;
    this.subscriptions.push(
      this.userFeedbackService.submitFeedback(this.fccGlobalConstantService.getSubmitFeedbackUrl(),
      this.feedbackRequest).subscribe(data => {
        if (data && data.response === FccGlobalConstant.REST_API_SUCCESS) {
          this.isFeedbackRequired = false;
          this.commonService.showToasterMessage({
            life: 5000,
            key: 'tc',
            severity: 'success',
            summary: 'Done',
            detail: `${this.translate.instant(data.message)}`
          });
        } else {
          this.commonService.showToasterMessage({
            life: 5000,
            key: 'tc',
            severity: 'error',
            summary: 'Error',
            detail: `${this.translate.instant(data.error)}`
          });
        }
      })
    );
  }

  get charactersEntered() {
    this.charactersEnteredValue = this.feedbackForm.get(FccConstants.FEEDBACK).value.length;
    return this.charactersEnteredValue;
  }

  resetForm() {
    this.isfeedbackSubmitted = false;
  }

}
