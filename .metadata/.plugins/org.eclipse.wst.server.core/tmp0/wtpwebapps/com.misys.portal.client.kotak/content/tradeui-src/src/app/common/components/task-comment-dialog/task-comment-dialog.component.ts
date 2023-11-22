import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng';
import { IUCommonDataService } from '../../../trade/iu/common/service/iuCommonData.service';
import { Constants } from '../../constants';
import { Comment } from '../../model/comment.model';
import { Task } from '../../model/task.model';
import { CommonDataService } from '../../services/common-data.service';
import { CommonService } from '../../services/common.service';
import { validateSwiftCharSet } from '../../validators/common-validator';
import { ValidationService } from '../../validators/validation.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'fcc-common-task-comment-dialog',
  templateUrl: './task-comment-dialog.component.html',
  styleUrls: ['./task-comment-dialog.component.scss']
})
export class TaskCommentDialogComponent implements OnInit {
  commentDetailsForm: UntypedFormGroup;
  taskIndex: any;
  task: Task;

  constructor(public fb: UntypedFormBuilder, public dialogRef: DynamicDialogRef,  public config: DynamicDialogConfig,
              public commonService: CommonService, public validationService: ValidationService,
              public commonDataService: IUCommonDataService, public commonData: CommonDataService,
              public datePipe: DatePipe, public translate: TranslateService) { }
  ngOnInit(): void {
    this.task =  this.config.data.task;
    this.taskIndex = this.config.data.taskIndex;
    this.commentDetailsForm = this.fb.group({
      comment: ['', [Validators.maxLength(Constants.LENGTH_200), validateSwiftCharSet(Constants.X_CHAR)]]
    });
  }

  getCommentInfo(comment: Comment): string {
    let message = '';
    if (comment.issueUserId === this.commonService.getSessionData().userId) {
      this.translate.get('PUBLIC_TASK_MESSAGE_WITHOUT_ISSUER_NAME', {date: comment.issueDate}).subscribe((res: string) => {
        message = res;
      });
    } else {
      this.translate.get('PUBLIC_TASK_MESSAGE_WITH_ISSUER_NAME', {name: (comment.issueUserFirstName + comment.issueUserLastName),
         date: comment.issueDate}).subscribe((res: string) => {
      message = res;
    });
  }
    return message;
  }

  saveComment() {
    this.commentDetailsForm.get('comment').markAllAsTouched();
    if (this.commentDetailsForm.get('comment') &&
    this.commentDetailsForm.get('comment').valid && this.commentDetailsForm.get('comment').value != null &&
    this.commentDetailsForm.get('comment').value !== '') {
    const currentDate = this.datePipe.transform(new Date(), Constants.TIMESTAMP_FORMAT);
    const comment = new Comment();
    comment.description = this.commentDetailsForm.get('comment').value;
    comment.taskId = this.task.taskId;
    const session = this.commonService.getSessionData();
    comment.issueCompanyName = session.companyName;
    comment.issueCompanyAbbvName = session.companyAbbvName;
    comment.issueDate = currentDate;
    comment.issueUserFirstName = session.userFirstName;
    comment.issueUserLastName = session.userLastName;
    comment.issueUserId = session.userId;
    this.commonService.createComment(comment.description, comment.issueDate, comment.taskId).subscribe(data => {​​​​​​​​
      if (this.task.comments != null) {
        this.task.comments.push(comment);
        } else {
          this.task.comments = [];
          this.task.comments.push(comment);
        }
      this.commentDetailsForm.get('comment').setValue('');
      (this.task.type !== Constants.CODE_01  ? this.commonService.editPublicTask(this.task, this.taskIndex) :
        this.commonService.editPrivateTask(this.task, this.taskIndex));
      }​
    );
  }
}

  exitComment() {
    this.dialogRef.close({event: Constants.SUCCESS});
  }
}
