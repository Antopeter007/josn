import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Subscription } from 'rxjs';
import { LcConstant } from './../../../corporate/trade/lc/common/model/constant';
import { FccBusinessConstantsService } from '../../core/fcc-business-constants.service';
import { FccGlobalConstantService } from '../../core/fcc-global-constant.service';
import { FccGlobalConstant } from '../../core/fcc-global-constants';
import { Task, TaskInput } from '../../model/task-model';
import { CommonService } from '../../services/common.service';
import { FccTaskService } from '../../services/fcc-task.service';
import { TransactionDetailService } from '../../services/transactionDetail.service';
import { TaskDialogComponent } from '../task-dialog/task-dialog.component';
import { ViewTaskDialogComponent } from '../view-task-dialog/view-task-dialog.component';

@Component({
  selector: 'fcc-task-listing',
  templateUrl: './task-listing.component.html',
  styleUrls: ['./task-listing.component.scss'],
})
export class TaskListingComponent implements OnInit, OnDestroy {
  taskDialog: DynamicDialogRef;
  taskSubscription: Subscription;
  @Input() inputParams: TaskInput;
  constructor(
    protected taskService: FccTaskService,
    protected transactionDetailService: TransactionDetailService,
    protected commonService: CommonService,
    protected activatedRoute: ActivatedRoute,
    protected fccGlobalConstantService: FccGlobalConstantService,
    protected dialogService: DialogService,
    protected translateService: TranslateService
  ) {
    this.taskSubscription = taskService.refreshTaskListing$.subscribe(task => {
        if (task) {
          this.ngOnInit();
      }
    });
  }

  // task cards array.
  taskCardsList: Task[] = [];
  // final tasks array in view
  viewCardsList: Task[] = [];
  // initial load 2 cards for display
  initialCardChunkSize = FccGlobalConstant.LENGTH_2;

  productCode: string;
  tnxId: string;
  contextPath: string;
  dir: string = localStorage.getItem('langDir');
  enableViewMore: boolean;
  enableViewLess = false;
  mode: string;
  lcConstant = new LcConstant();
  readonly taskname = 'task_name';
  readonly taskid = 'task_id';
  readonly tasktype = 'type';
  readonly performed = 'performed';
  readonly taskdate = 'issue_date';
  readonly assigneetype = 'assignee_type';
  readonly desc = 'description';
  readonly comments = 'comments';
  readonly task = 'task';
  readonly userFirstName = 'issue_user_first_name';
  readonly userLastName = 'issue_user_last_name';
  readonly assignees = 'assignees';
  readonly assigneeType = 'assignee_type';
  readonly destinationMail = 'dest_user_email';
  readonly bankName = 'dest_company_name';
  readonly bankShortName = 'dest_company_abbv_name';
  readonly destUserId = 'dest_user_id';
  readonly destLoginId = 'dest_user_login_id';
  readonly issuerUserId = 'issue_user_id';
  readonly destBankEmailNotify = 'dest_company_email_notif';
  readonly destOtherUserEmailNotify = 'dest_user_email_notif';
  readonly issuerMail = 'email';
  readonly issuerEmailNotify = 'email_notification';

  ngOnInit(): void {
    this.taskCardsList = [];
    this.viewCardsList = [];
    this.enableViewMore = false;
    this.enableViewLess = false;
    this.contextPath = this.fccGlobalConstantService.contextPath;
    this.activatedRoute.queryParams.subscribe((params) => {
      this.productCode = params[FccGlobalConstant.PRODUCT];
      this.tnxId = params[FccGlobalConstant.TNX_ID];
      this.mode = FccGlobalConstant.MODE;
    });
   
    // If Ref ID exists then read from form state
    if (this.commonService.isnonEMptyString(this.commonService.referenceId) 
        && !this.tnxId && this.mode !== FccGlobalConstant.INITIATE ) {
      this.tnxId = this.commonService.eventId;
    }
   
    if (this.tnxId) {
      this.transactionDetailService
        .fetchTransactionDetails(this.tnxId, this.productCode)
        .subscribe((response) => {
          const responseObj = response.body;
          this.taskService.setTnxResponseObj(responseObj);
          const tasksobj = this.taskService.getTasksObj();
          if (tasksobj) {
            this.constructTasksList(tasksobj);
            this.updateCardsListing(this.initialCardChunkSize);
            this.enableViewMore = this.taskCardsList.length > this.initialCardChunkSize;
            const value = this.taskService.currentTaskIdFromWidget$.getValue();
            if (value) {
                let taskWidget;
                for (let i = 0 ; i < this.taskCardsList.length; i++){
                  if (value === this.taskCardsList[i].taskId){
                    taskWidget = this.taskCardsList[i];
                    this.taskService.currentTaskIdFromWidget$.next(null);
                    break;
                  }
                }
                if (taskWidget){
                  this.onClickComment('event', taskWidget);
              }
            }
          }
        });
    }
  }

  private constructTasksList(tasks) {
    this.taskCardsList = [];
    const tasksObj = tasks[this.task];
    if (Array.isArray(tasksObj)) {
      const taskObject = tasksObj.slice(0).reverse();
      for (let i = 0; i < taskObject.length; i++) {
        this.ValidateAndAddTask(taskObject[i]);
      }
    } else {
      this.ValidateAndAddTask(tasksObj);
    }
  }

  private updateCardsListing(chunkSize?) {
    this.viewCardsList = [];
    const taskCardsListSize = chunkSize ? (this.taskCardsList.length > chunkSize) ? chunkSize : this.taskCardsList.length
    : this.taskCardsList.length;
    for (let i = 0; i < taskCardsListSize; i++) {
    this.viewCardsList.push(this.taskCardsList[i]);
    }
  }
  private ValidateAndAddTask(taskObj) {
    if (this.isTaskAllowed(taskObj)) {
      const task = this.setTaskCard(taskObj);
      this.taskCardsList.push(task);
    }
  }

  /**
   * allowed only if public task or created self and assigned to bank or assigned to self
   * @param taskObj  task object
   */
  private isTaskAllowed(task): boolean {
    return (
      task[this.tasktype] === FccGlobalConstant.STRING_02 ||
      task[this.destUserId] === this.commonService.loginUserId ||
      task[this.issuerUserId] === this.commonService.loginUserId
    );
  }

  private setTaskCard(taskObj) {
    const task: Task = {
      name: taskObj[this.taskname],
      description: taskObj[this.desc],
      date: taskObj[this.taskdate],
      taskId: taskObj[this.taskid],
      type: taskObj[this.tasktype],
      performed: taskObj[this.performed],
      issuerName: taskObj[this.userFirstName] + ' ' + taskObj[this.userLastName],
      commentLength: this.taskService.getCommentLength(taskObj) > 0 ? this.taskService.getCommentLength(taskObj) : '',
      destinationMail: taskObj[this.destinationMail],
      bankShortName: taskObj[this.bankShortName],
      assigneeType: taskObj[this.assigneeType],
      destLoginId: taskObj[this.destLoginId],
      destUserId: taskObj[this.destUserId],
      issuerMail: taskObj[this.issuerMail],
      issuerId: taskObj[this.issuerUserId],
      assignees: taskObj[this.assignees],
      bankName: taskObj[this.bankName],
      canEdit: taskObj[this.issuerUserId] === this.commonService.loginUserId, // enable for only task creater
      destBankEmailNotify: taskObj[this.destBankEmailNotify],
      destOtherUserEmailNotify: taskObj[this.destOtherUserEmailNotify],
      issuerEmailNotify: taskObj[this.issuerEmailNotify]
    };
    return task;
  }

  onClickEdit(event, task: Task) {
    this.taskDialog = this.dialogService.open(TaskDialogComponent, {
      header: `${this.translateService.instant('editTask')}`,
      data: {
        task,
      },
      showHeader: true,
      closable: true,
      width: '65vw',
      height: 'auto',
      contentStyle: {
        overflow: 'auto',
        height: 'auto',
        appendTo: 'body',
        blockScroll: true,
        direction: this.dir,
      },
      style: { direction: this.dir },
      baseZIndex: 1000,
      autoZIndex: true,
      dismissableMask: false,
      closeOnEscape: true,
      styleClass: 'taskLayoutClass',
    });
  }

  // view task pane for comment
  onClickComment($event, task) {
    const dir = this.dir;
    this.taskDialog = this.dialogService.open(ViewTaskDialogComponent, {
      header: task.name ? task.name : task.description,
      showHeader: true,
      closable: true,
      width: '65vw',
      data: {
        task_id: task.taskId,
      },
      style: { direction: this.dir },
      contentStyle: { direction: dir },
      baseZIndex: 1000,
      autoZIndex: true,
      dismissableMask: false,
      closeOnEscape: true,
      styleClass: 'viewTaskLayoutClass',
    });
  }

  /**
   * view all tasks
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onClickMore(event) {
    this.enableViewMore = false;
    this.enableViewLess = true;
    this.constructTasksList(this.taskService.getTasksObj());
    this.updateCardsListing();
  }

  /**
   * Collapse all tasks and show default
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onClickLess(event) {
    this.enableViewLess = false;
    this.enableViewMore = true;
    this.constructTasksList(this.taskService.getTasksObj());
    this.updateCardsListing(this.initialCardChunkSize);
  }

  refreshListing() {
    this.ngOnInit();
  }

  getType(value) {
    return this.taskService.getTaskType(value);
  }

  getStatus(value) {
    return this.taskService.getTaskStatus(value);
  }

  ngOnDestroy() {
    this.taskCardsList = [];
    this.viewCardsList = [];
    this.taskService.refreshTaskListing$.next(false);
  }

  onClickTaskAction(event, id) {
    // toggle behaviour
    const status = event === FccBusinessConstantsService.YES ? false : true;
    this.taskService.updateTaskStatus(id, status).subscribe((res) => {
      if (res) {
        const index = this.viewCardsList.findIndex((task) => task.taskId === id);
        this.viewCardsList[index].performed = status ? FccBusinessConstantsService.YES : FccBusinessConstantsService.NO;
      }
    },
    () => {
      //eslint : no-empty-function
    });
  }

  keyPressOptionsForComment(event, task) {
    const keycodeIs = event.which || event.keyCode;
    if (keycodeIs === this.lcConstant.thirteen) {
      this.onClickComment(event, task);
    }
  }

  keyPressOptionsForEdit(event, task) {
    const keycodeIs = event.which || event.keyCode;
    if (keycodeIs === this.lcConstant.thirteen) {
      this.onClickEdit(event, task);
    }
  }


}
