import { Component, ElementRef, OnInit } from '@angular/core';
import { UntypedFormBuilder } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';
import { UtilityService } from './../../../corporate/trade/lc/initiation/services/utility.service';
import { FccGlobalConfiguration } from '../../core/fcc-global-configuration';
import { FccGlobalConstantService } from '../../core/fcc-global-constant.service';
import { FccGlobalConstant } from '../../core/fcc-global-constants';
import { Task, Comment, CommentsForPost } from '../../model/task-model';
import { FccTaskService } from '../../services/fcc-task.service';
import { ActivatedRoute } from '@angular/router';
import { CommonService } from '../../services/common.service';
import { TransactionDetailService } from '../../services/transactionDetail.service';
import { LcConstant } from './../../../corporate/trade/lc/common/model/constant';
import { NarrativeTextareaControl } from '../../../base/model/form-controls.model';
import { FCCBase } from '../../../base/model/fcc-base';
import { FormControlService } from './../../../corporate/trade/lc/initiation/services/form-control.service';
import { FCCFormGroup } from '../../../base/model/fcc-control.model';
import { FccBusinessConstantsService } from '../../core/fcc-business-constants.service';

@Component({
  selector: 'app-view-task-dialog',
  templateUrl: './view-task-dialog.component.html',
  styleUrls: ['./view-task-dialog.component.scss']
})
export class ViewTaskDialogComponent extends FCCBase implements OnInit {

  description;
  addComment;
  commentsLabel;
  tasksObj: any;
  taskDetailsRequest: Task = {};
  commentDetailsRequest: Comment[] = [];
  commentsForPost: CommentsForPost = {};
  commentLength = 0;
  commentForm: FCCFormGroup;
  iconImagePath: any;
  productCode: string;
  tnxId: string;
  prevButtonStyle: any;
  addCommentPermission = false;
  dir: string = localStorage.getItem('langDir');
  lcConstant = new LcConstant();
  field: any = {};

  // for textarea
  private strResult = '';
  private enteredCharCount = 0;
  params = this.lcConstant.params;
  maxlength = this.lcConstant.maxlength;
  maxRowCount = this.lcConstant.maxRowCount;
  enteredCharCounts = this.lcConstant.enteredCharCounts;
  rowCounts = this.lcConstant.rowCount;
  allowedCharCount = this.lcConstant.allowedCharCount;
  disableNextLineCharCount = this.lcConstant.disableNextLineCharCount;
  fieldSize = this.lcConstant.fieldSize;
  rows = this.lcConstant.rows;
  styleClass = this.lcConstant.styleClass;
  cols;
  definedCols;
  totalRowCount;
  maxRows;
  errorHeader = `${this.translateService.instant('errorTitle')}`;
  constructor(protected translateService: TranslateService, protected fccTaskService: FccTaskService,
              protected dynamicDialogConfig: DynamicDialogConfig, protected fb: UntypedFormBuilder,
              protected fccGlobalConstantService: FccGlobalConstantService, protected fccGlobalConfiguration: FccGlobalConfiguration,
              protected utilityService: UtilityService, protected activatedRoute: ActivatedRoute,
              protected commonService: CommonService, protected transactionDetailService: TransactionDetailService,
              protected formControlService: FormControlService, protected elementRef: ElementRef) {
                super();
              }



  ngOnInit(): void {
    // if component used for dialog, set input from dialog config
    if (this.dynamicDialogConfig.data) {
      this.taskDetailsRequest.taskId = this.dynamicDialogConfig.data.task_id;
    }

    this.commonService.getUserPermission(FccGlobalConstant.COLLAB_ADD_COMMENT).subscribe(res => {
      if (res) {
        this.addCommentPermission = true;
      }
    });
    // let comments: AbstractControl;
    this.commentForm = new FCCFormGroup({
      comments: new NarrativeTextareaControl('comments', '', this.translateService, {
        label: '',
        styleClass: '',
        fieldSize: 40,
        key: 'comments',
        maxRowCount: 4,
        rows: 4,
        cols: 40,
        allowedCharCount : 160,
        maxlength: 200
      })

    });

    this.iconImagePath = this.fccGlobalConstantService.contextPath + '/content/FCCUI/assets/images/userIcon.png';
    this.description = this.translateService.instant('description');
    this.addComment = this.translateService.instant('addComment');
    this.commentsLabel = this.translateService.instant('comments');

    this.tasksObj = this.fccTaskService.getTasksObj();
    this.viewTask(this.tasksObj, this.taskDetailsRequest.taskId);
    this.addAccessibilityControl();
  }

  addAccessibilityControl(): void {
    const titleBarCloseList = Array.from(document.getElementsByClassName('ui-dialog-titlebar-close'));
    titleBarCloseList.forEach(element => {
      element[FccGlobalConstant.ARIA_LABEL] = this.translateService.instant('close');
      element[FccGlobalConstant.TITLE] = this.translateService.instant('close');
    });    
  }

  getStatus(value) {
    return this.fccTaskService.getTaskStatus(value);
  }

  viewTask(tasksObj: any, taskId: string) {
    if (tasksObj.task) {
      if (Array.isArray(tasksObj.task)) {
        tasksObj.task.forEach(element => {
          if (element.task_id === taskId) {
            this.commentLength = this.fccTaskService.getCommentLength(element);
            this.addtaskItems(element);
          }
        });
      } else {
          if (tasksObj.task.task_id === taskId) {
            this.commentLength = this.fccTaskService.getCommentLength(tasksObj.task);
            this.addtaskItems(tasksObj.task);
          }
        }
    }
  }

  addtaskItems(element: any) {
    let formattedDate = '';
    let formattedDateComment = '';
    formattedDate = element.issue_date;
    this.taskDetailsRequest.date = formattedDate;
    this.taskDetailsRequest.performed = element.performed;
    this.taskDetailsRequest.description = element.description.replace(/\n/g, '<br>');

    this.taskDetailsRequest.name = element.issue_user_first_name + ' ' + element.issue_user_last_name;
    this.taskDetailsRequest.type = this.fccTaskService.getTaskType(element.type);
    this.commentDetailsRequest = [];
    if (element.comments) {
      if (Array.isArray(element.comments.comment)) {
        element.comments.comment.reverse().forEach(comment => {
          formattedDateComment = comment.issue_date;
          const commentData: Comment = {
            fullName:
              comment.issue_user_first_name + ' ' + comment.issue_user_last_name,
            issueDate: formattedDateComment,
            descriptionOfComment: comment.description
          };
          this.commentDetailsRequest.push(commentData);
        });
      } else {
        formattedDateComment = element.issue_date;
        const commentData: Comment = {
          fullName: element.comments.comment.issue_user_first_name + ' ' + element.comments.comment.issue_user_last_name,
          issueDate : formattedDateComment,
          descriptionOfComment: element.comments.comment.description
        };
        this.commentDetailsRequest.push(commentData);
        }
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onPostComment(event) {
    if (this.commentForm && this.commentForm.controls.comments.value) {
      this.commentsForPost.description = this.commentForm.controls.comments.value;
      this.commentsForPost.taskId = this.taskDetailsRequest.taskId;
      this.fccTaskService.addCommentToTask(this.commentsForPost, this.taskDetailsRequest.taskId).subscribe(
      () => {
        this.getTaskDetails();
        this.fccTaskService.refreshTaskListing$.next(true);
      },
      () => {
        //eslint : no-empty-function
      }
    );
    }

  }

  getTaskDetails() {
    this.activatedRoute.queryParams.subscribe((params) => {
      this.productCode = params[FccGlobalConstant.PRODUCT];
      this.tnxId = params[FccGlobalConstant.TNX_ID];
    });
    if (!this.tnxId) {
      this.tnxId = this.commonService.eventId;
    }
    if (this.tnxId) {
      this.transactionDetailService
        .fetchTransactionDetails(this.tnxId, this.productCode)
        .subscribe((response) => {
          const responseObj = response.body;
          this.fccTaskService.setTnxResponseObj(responseObj);
          this.ngOnInit();
        });
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onFocusComment(event) {
  this.validateRowAndCharacterCount();
}

  protected validateRowAndCharacterCount() {
    this.strResult = '';
    let intCountCol = 0;
    const strInput = this.commentForm.controls.comments.value;
    let rowCount = 1;
    this.cols = this.commentForm.controls.comments[this.params][this.lcConstant.cols];
    this.definedCols = this.lcConstant.sixtySix;
    const maxrows = this.commentForm.controls.comments[this.params][this.maxRowCount];
    const disableNextLineCount = this.commentForm.controls.comments[this.params][this.disableNextLineCharCount];
    for (let k = 0; k < strInput.length; k++) {
      const strCurrentChar = strInput.charAt(k);

      if ((strCurrentChar === '\r' ) || (strCurrentChar === '\n')) {
        this.strResult += '\n';
        rowCount++;
        intCountCol = 0;
        if (strCurrentChar === '\r') {
          k++;
        }
      } else if (intCountCol === this.cols) {
        intCountCol = 1;
        this.strResult += strCurrentChar;
        rowCount++;
      } else {
        // Otherwise we simply copy the character and increment the counter:
          this.strResult += strCurrentChar;
          intCountCol++;
      }
    }
    this.totalRowCount = rowCount;
    this.maxRows = maxrows;
    this.enteredCharCount = 0;
    if (this.strResult !== '' && disableNextLineCount ) {
      this.getCharCount();
    } else if (this.strResult !== '') {
      if (this.cols === FccGlobalConstant.LENGTH_35) {
        this.enteredCharCount = this.commonService.countInputChars(this.strResult);
      } else {
        this.enteredCharCount = this.commonService.counterOfPopulatedData(this.strResult);
      }
    }
    this.commentForm.controls.comments.setValue(this.strResult);
    this.commentForm.controls.comments[this.params][this.enteredCharCounts] = this.enteredCharCount;
    if (maxrows !== '' && rowCount > maxrows && disableNextLineCount) {
      this.commentForm.controls.comments.setErrors({ rowCountExceeded: { enteredRow: rowCount, maxRows: maxrows } });
    } else if (maxrows !== '' && rowCount > maxrows) {
      this.commentForm.controls.comments
      .setErrors({ rowCountMoreThanAllowed: { enteredRow: rowCount, maxRows: maxrows, charPerRow: this.cols } });
    } else {
        if (this.enteredCharCount === 0) {
          this.commentForm.controls.comments[this.params][this.rowCounts] = 0;
        } else {
          this.commentForm.controls.comments[this.params][this.rowCounts] = rowCount;
        }
    }
    this.validateTextAreaOnLoad();
 }

 getCharCount() {
  this.enteredCharCount = this.strResult.length;
 }

 validateTextAreaOnLoad() {
  if (this.commentForm.controls.comments.hasError('rowCountExceeded')) {
    this.commentForm.controls.comments.markAsDirty();
    this.commentForm.controls.comments.markAsTouched();
    this.commentForm.controls.comments.setErrors({ rowCountExceeded: { enteredRow: this.totalRowCount, maxRows: this.maxRows } });
  } else if (this.commentForm.controls.comments.hasError('rowCountMoreThanAllowed')) {
    this.commentForm.controls.comments.markAsDirty();
    this.commentForm.controls.comments.markAsTouched();
    this.commentForm.controls.comments
    .setErrors({ rowCountMoreThanAllowed: { enteredRow: this.totalRowCount, maxRows: this.maxRows, charPerRow: this.cols } });
  }


}

onClickTaskAction(event, id) {
  // toggle behaviour
  const status = event === FccBusinessConstantsService.YES ? false : true;
  this.fccTaskService.updateTaskStatus(id, status).subscribe(
  () => {
    this.getTaskDetails();
    this.fccTaskService.refreshTaskListing$.next(true);
  },
  () => {
    //eslint : no-empty-function
  });
}





}

