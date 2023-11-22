import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { UtilityService } from '../../corporate/trade/lc/initiation/services/utility.service';
import { FccGlobalConstantService } from '../core/fcc-global-constant.service';
import { FccGlobalConstant } from '../core/fcc-global-constants';
import { CommentsForPost, Task, TaskStatus } from '../model/task-model';
import { TaskSubmission } from '../model/taskSubmission';
/**
 * task service
 */
@Injectable({ providedIn: 'root' })
export class FccTaskService {
  corporateBanks: DropDown[] = [];
  // to notify transaction save when a task has been created first time
  notifySaveTransactionfromTask$ = new BehaviorSubject(false);
  // to notify creating task after initiate transaction is saved(refId generated)
  notifyTaskAfterSaveTnx$ = new BehaviorSubject(false);
  // reload task listing
  refreshTaskListing$ = new BehaviorSubject(false);
  // As subsequent tasks of a transaction have same todolist
  private todoListId: string;
  // store the taskentity as it should be in sync with ongoing transaction
  private taskEntity: any;
  // cache current transaction response obj
  private tnxResponseObj: any;
  private currentUserId: string;
  private tasksObj: any;
  private todolistObj: any;
  // todoLists array
  private todoLists: any[] = [];
  // tasks array
  private tasks: Task[] = [];

  readonly todolists = 'todo_lists';
  readonly todolist = 'todo_list';
  readonly todolistId = 'todo_list_id';
  contentType = 'Content-Type';
  // Passing the task ID
  currentTaskIdFromWidget$ = new BehaviorSubject<string>('');
  // store the taskBank as it should sync with transaction
  taskBank: any;
  dashboardCategory: any;

  constructor(
    protected http: HttpClient, protected utilityService: UtilityService,
    protected fccGlobalConstantService: FccGlobalConstantService, protected translateService: TranslateService
  ) {}

  /**
   * post request for creating a task
   * @param taskRequest - request object TaskSubmission
   */
  public createTask(taskRequest: TaskSubmission): Observable<any> {
    const headers = new HttpHeaders({ 'cache-request': 'true', 'Content-Type': FccGlobalConstant.APP_JSON });
    const reqUrl = `${this.fccGlobalConstantService.createTask}`;

    return this.http.post<any>(reqUrl, taskRequest, { headers });
  }

  /**
   * put request for updating a task
   * @param taskRequest - request object TaskSubmission
   */
  public updateTask(taskRequest: TaskSubmission, taskId): Observable<any> {
    const headers = new HttpHeaders({ 'cache-request': 'true', 'Content-Type': FccGlobalConstant.APP_JSON });
    const reqUrl = `${this.fccGlobalConstantService.updateTask(taskId)}`;

    return this.http.put<any>(reqUrl, taskRequest, { headers });
  }

  /**
   * post task status
   */
  public updateTaskStatus(taskId, status: boolean): Observable<any> {
    const headers = new HttpHeaders({ 'cache-request': 'true', 'Content-Type': FccGlobalConstant.APP_JSON });
    const reqUrl = `${this.fccGlobalConstantService.updateTaskStatus(taskId)}`;
    const taskRequest: TaskStatus = {
      isComplete: status
    };
    return this.http.post<any>(reqUrl, taskRequest, { headers });
  }

  /**
   * get collaboration users
   */
  public getCollabUsers(productCode, entityName): Observable<any> {
    const headers = new HttpHeaders({ 'cache-request': 'true', 'Content-Type': FccGlobalConstant.APP_JSON });
    const reqUrl = `${this.fccGlobalConstantService.CollabUsers}`;
    const reqPayload = {
      requestData: { productCode, option: 'user_collaboration', entityName },
    };
    return this.http.post<any>(reqUrl, reqPayload, { headers });
  }

  public getTodoListId() {
    const todolistid = 'todo_list_id';
    if (this.getTodoListObj()) {
      this.todoListId = this.getTodoListObj()[todolistid];
    }
    return this.todoListId;
  }

  public setTodoListId(value) {
    this.todoListId = value;
  }

  public getTaskEntity() {
    return this.taskEntity;
  }

  public setTaskEntity(value: any) {
    this.taskEntity = value;
  }
  public getTaskBank(){
    return this.taskBank;
  }

  /**
   * get current transaction api response obj.
   * recommended to use *only* for tasks related requirements to avoid undesired sync issues.
   */
  public getTnxResponseObj() {
    return this.tnxResponseObj ? this.tnxResponseObj : '';
  }

  /**
   * current transaction api response
   * @param value transaction object
   */
  public setTnxResponseObj(value: any) {
    this.tnxResponseObj = value;
  }

  public getTasksObj() {
    const tasks = 'tasks';
    if (this.getTodoListObj()) {
      this.tasksObj = this.getTodoListObj()[tasks];
    }
    return this.tasksObj;
  }

  public getTodoListObj() {
    const todoLists = 'todo_lists';
    const todolist = 'todo_list';
    if (this.getTnxResponseObj()[todoLists]) {
      this.todolistObj = this.getTnxResponseObj()[todoLists][todolist];
    }
    return this.todolistObj;
  }

  resetTaskData() {
    this.tnxResponseObj = undefined;
    this.taskEntity = undefined;
    this.todoListId = undefined;
    this.tasksObj = undefined;
    this.todolistObj = undefined;
    this.taskBank = undefined;
  }

  public isTodoListCreated() {
    return this.getTodoListId();

  }

  public getTaskType(type) {
    switch (type) {
      case FccGlobalConstant.STRING_01:
        return this.translateService.instant('TASK_TYPE_01');
      case FccGlobalConstant.STRING_02:
        return this.translateService.instant('TASK_TYPE_02');
      case FccGlobalConstant.STRING_03:
        return this.translateService.instant('TASK_TYPE_03');
      }
    }

    public getTaskStatus(status) {
      return status === 'Y' ? this.translateService.instant('TASK_ACTION_COMPLETED') : this.translateService.instant('TASK_ACTION_PENDING');
    }


  public setTaskBank(value: any, componentType?: any){
    if (componentType !== 'external'){
    this.taskBank = value;
    }
    else{
      for (let i = 0; i < this.corporateBanks.length; i++){
        if (this.corporateBanks[i].value.value === value){
          this.taskBank = this.corporateBanks[i].value;
          break;
        }
      }
    }
  }

  public addCommentToTask(commentRequest: CommentsForPost, taskId): Observable<any> {
    const iKey = this.fccGlobalConstantService.generateUIUD();
    const obj = {};
    obj[this.contentType] = FccGlobalConstant.APP_JSON;
    obj[FccGlobalConstant.idempotencyKey] = iKey;
    const headers = new HttpHeaders(obj);
    // const headers = new HttpHeaders({'cache-request': 'true', 'Content-Type': FccGlobalConstant.APP_JSON});
    const reqUrl = `${this.fccGlobalConstantService.addCommentToTask}${taskId}`;
    return this.http.post<any>(reqUrl, commentRequest, { headers });
  }

  public getCommentLength(task) {
    if (task.comments) {
      if (Array.isArray(task.comments.comment)) {
        return task.comments.comment.length;
      } else {
        return 1;
      }
    } else {
      return -1;
    }
  }

public getDashboardCategory(value: any){
  this.dashboardCategory = value;
}

  /**
   * get ongoing task widget details
   */
    public getTaskWidgetDetails(dashboardCategory): Observable<any> {
     const headers = new HttpHeaders({ 'Content-Type': FccGlobalConstant.APP_JSON });
     const params = new HttpParams().set('dashboardCategory', dashboardCategory ? dashboardCategory : '');
     return this.http.get<any>( this.fccGlobalConstantService.taskWidgetDetails, { headers , params });
  }
}

export interface DropDown {
  label: string;
  value: {
    label: string;
    value?: string;
  };
}
