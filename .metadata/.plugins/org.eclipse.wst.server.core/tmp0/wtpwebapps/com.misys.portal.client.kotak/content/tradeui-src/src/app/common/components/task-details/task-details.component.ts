import { DatePipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { data } from 'jquery';
import { DialogService } from 'primeng';
import { IUCommonDataService } from '../../../../app/trade/iu/common/service/iuCommonData.service';
import { Constants } from '../../constants';
import { Task } from '../../model/task.model';
import { CommonDataService } from '../../services/common-data.service';
import { CommonService } from '../../services/common.service';
import { TaskCommentDialogComponent } from '../task-comment-dialog/task-comment-dialog.component';
import { TaskDialogComponent } from '../task-dialog/task-dialog.component';

@Component({
  selector: 'fcc-common-task-details',
  templateUrl: './task-details.component.html',
  styleUrls: ['./task-details.component.scss']
})

export class TaskDetailsComponent implements OnInit {
  hide: boolean;
  @Input() public bgRecord;
  taskCount = 0;

  constructor(public translate: TranslateService, public commonService: CommonService,  public dialogService: DialogService,
              public commonDataService: IUCommonDataService, public commonData: CommonDataService,
              public datePipe: DatePipe) { }

  ngOnInit(): void {
    this.hide = true;
    if (this.bgRecord && this.bgRecord.productCode === Constants.PRODUCT_CODE_IU &&
      this.bgRecord.recipientBank.abbvName && this.bgRecord.recipientBank.name) {
      this.commonService.setMainBankDetails(this.bgRecord.recipientBank.abbvName, this.bgRecord.recipientBank.name);
    } else if (this.bgRecord && this.bgRecord.productCode === Constants.PRODUCT_CODE_RU &&
      this.bgRecord.advisingBank.abbvName && this.bgRecord.advisingBank.name) {
        this.commonService.setMainBankDetails(this.bgRecord.advisingBank.abbvName, this.bgRecord.advisingBank.name);
    }
    if (this.bgRecord &&  this.bgRecord.entity != null && this.bgRecord.entity !== '') {
      this.commonData.setEntity(this.bgRecord.entity);
    }
    if (this.bgRecord.todoLists && this.bgRecord.todoLists.todoList && this.bgRecord.todoLists.todoList.length > 0) {
      this.bgRecord.todoLists.todoList.forEach(element => {
        if (!(this.commonService.getTnxToDoListId() != null && this.commonService.getTnxToDoListId() !== '')) {
          this.commonService.setTnxToDoListId(element.todoListId);
        }
        this.fetchTaskDetails(element);
      });
  }
    this.commonService.setboInpDttm = this.bgRecord.boInpDttm;

}

fetchTaskDetails(element) {
  element.tasks.forEach(tasklist => {
    tasklist.task.forEach(task => {
      if ((this.commonData.getIsBankUser() && task.type === Constants.CODE_03 && task.assigneeType === Constants.CODE_02) ||
      (!this.commonData.getIsBankUser() && ((task.issueUserId === this.commonService.getSessionData().userId) ||
      (task.type === Constants.CODE_02) || (task.type === Constants.CODE_03 && task.assigneeType === Constants.CODE_02)
      || (task.type === Constants.CODE_03 && task.assigneeType === Constants.CODE_01 &&
        (task.destUserId === this.commonService.getSessionData().userId))))) {
        this.taskCount = this.taskCount + 1;
    }
      if (task.type === Constants.CODE_01) {
      this.commonService.addPrivateTask(task);
    } else {
      this.commonService.addPublicTask(task);
    }
      if (task.comments !== null && task.comments !== '') {
      task.comments.forEach(comments => {
      comments.comment.forEach(comment => {
      task.comments.push(comment);
        });
      });
    }
  });
});
}

showPanel($event, taskPanel) {
    this.hide = !this.hide;
    taskPanel.toggle($event);
  }
  onResize($event, taskPanel) {
    if (this.hide) {
      taskPanel.hide($event);
    } else {
      taskPanel.show($event);
    }
  }
  onCheckTaskCheckBox(task, index) {
    let isComplete;
    if (task.performed === Constants.NO) {
    task.performed = Constants.YES;
    isComplete =  true;
    } else {
      task.performed = Constants.NO;
      isComplete = false;
    }
    this.commonService.completeTask(isComplete, task.taskId).subscribe(() => {
      if (task.type !== Constants.CODE_01) {
        this.commonService.editPublicTask(task, index);
      } else {
        this.commonService.editPrivateTask(task, index);
      }
    });
  }
  editTask(taskType, task, index) {
    this.showDialog(Constants.MODE_DRAFT, taskType, task, index);
  }

  addTaskComment(task, index) {
    let dialogHeader = '';
    this.translate.get('USER_COMMENTS').subscribe((res: string) => {
      dialogHeader = res;
    });
    this.dialogService.open(TaskCommentDialogComponent, {
      header: dialogHeader,
      width: '55vw',
      height: '65vh',
      contentStyle: {overflow: 'auto', height: '65vh'},
      data: {task, index}
    });
  }

  get publicTask() {
    return this.commonService.getPublicTasks();
  }
  get privateTask() {
    return this.commonService.getPrivateTasks();
  }
  getTaskMessage(task: Task): string {
    let message = '';
    if (task.type === Constants.CODE_02 || task.type === Constants.CODE_01) {
      if (task.issueUserId === this.commonService.getSessionData().userId)  {
        this.translate.get('PUBLIC_TASK_MESSAGE_WITHOUT_ISSUER_NAME', {date: task.issueDate}).subscribe((res: string) => {
        message = res;
      });
    } else {
      this.translate.get('PUBLIC_TASK_MESSAGE_WITH_ISSUER_NAME', {name: (task.issueUserFirstName + task.issueUserLastName),
        date: task.issueDate}).subscribe((res: string) => {
      message = res;
    });
  }
    } else {
        const assigneeName = (task.assigneeType === Constants.CODE_02 ? task.destCompanyName : task.destUserLoginId);
        if (task.issueUserId === this.commonService.getSessionData().userId)  {
          this.translate.get('ASSIGNEE_TASK_MESSAGE_WITHOUT_ISSUER_NAME', {name: assigneeName,
             date: task.issueDate}).subscribe((res: string) => {
            message = res;
          });
        } else {
          this.translate.get('ASSIGNEE_TASK_MESSAGE', {issuer: (task.issueUserFirstName + task.issueUserLastName),
            name: assigneeName, date: task.issueDate}).subscribe((res: string) => {
          message = res;
        });
      }
    }
    return message;
  }

  showDialog(eventType, taskType, task, index) {
    let dialogHeader = '';
    let height;
    let entityExist = true;
    if (this.commonDataService.getTnxType() === Constants.TYPE_NEW &&
      (!(this.commonData.getEntity() && this.commonData.getEntity() != null && this.commonData.getEntity() !== '') || (
      this.commonService.getNumberOfEntities() < 1 &&
      !(this.bgRecord && this.bgRecord.applicantName != null && this.bgRecord.applicantName !== '')))) {
      entityExist = false;
    }
    if (taskType === Constants.PUBLIC_TASK) {
      task.type = (eventType === Constants.MODE_DRAFT ? task.type : Constants.CODE_02);
      height = '60vh';
    } else {
      task.type = Constants.CODE_01;
      height = '30vh';
    }
    this.translate.get('TASK_DETAILS').subscribe((res: string) => {
      dialogHeader = res;
    });
    const ref = this.dialogService.open(TaskDialogComponent, {
      header: dialogHeader,
      width: '55vw',
      height,
      contentStyle: {overflow: 'auto', height},
      data: {eventType, taskType, task, index, entityExist}
    });
    ref.onClose.subscribe((result: any) => {
      if (result.event === Constants.SUCCESS && eventType !== Constants.MODE_DRAFT) {
        this.taskCount = this.taskCount + 1;
      }
    });
  }

  addTask(taskType) {
    const task = this.createNewTask();
    task.emailNotification = Constants.NO;
    task.destCompanyEmailNotif = Constants.NO;
    this.showDialog('', taskType, task, '');
  }

  createNewTask(): Task {
    const task = new Task();
    task.description = '';
    task.emailNotification = Constants.NO;
    task.email = '';
    task.assigneeType = '';
    task.destUserLoginId = '';
    task.destCompanyName = '';
    task.destUserEmailNotif = '';
    task.performed = Constants.NO;
    task.comments = [];
    return task;
  }

}
