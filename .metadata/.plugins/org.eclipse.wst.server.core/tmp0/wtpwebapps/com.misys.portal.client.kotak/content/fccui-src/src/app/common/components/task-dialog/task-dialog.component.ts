import { DatePipe } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Subscription } from 'rxjs';
import { FCCBase } from '../../../base/model/fcc-base';
import { FCCFormGroup } from '../../../base/model/fcc-control.model';
import { FormControlService } from '../../../corporate/trade/lc/initiation/services/form-control.service';
import { FccBusinessConstantsService } from '../../core/fcc-business-constants.service';
import { FccGlobalConstant } from '../../core/fcc-global-constants';
import { BankUserDetails } from '../../model/bankUserDetails';
import { IssuerDetails } from '../../model/issuerDetails';
import { ReceiverDetails } from '../../model/receiverDetails';
import { TaskDetails } from '../../model/taskDetails';
import { TaskSubmission } from '../../model/taskSubmission';
import { CommonService } from '../../services/common.service';
import { DropDownAPIService } from '../../services/dropdownAPI.service';
import { FccTaskService } from '../../services/fcc-task.service';
import { FormModelService } from '../../services/form-model.service';
import { MultiBankService } from '../../services/multi-bank.service';
import { Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { HOST_COMPONENT } from './../../../shared/FCCform/form/form-resolver/form-resolver.directive';

/**
 * Task dialog component which handles the task section on opening a form.
 * same dialog being used for create task and edit task.
 */
@Component({
  selector: 'fcc-task-dialog',
  templateUrl: './task-dialog.component.html',
  styleUrls: ['./task-dialog.component.scss'],
  providers: [{ provide: HOST_COMPONENT, useExisting: TaskDialogComponent }]
})
export class TaskDialogComponent extends FCCBase implements OnInit, OnDestroy {
  referenceId: any;
  eventId: any;
  taskSubscription: Subscription;
  productCode: any;
  isTaskSaveInitiated = false;
  bankPermission = false;
  constructor(
    protected formModelService: FormModelService,
    protected formControlService: FormControlService,
    protected dialogCloseRef: DynamicDialogRef,
    protected commonService: CommonService,
    protected taskService: FccTaskService,
    protected datePipe: DatePipe,
    protected multiBankService: MultiBankService,
    protected activatedRoute: ActivatedRoute,
    protected dropDownAPIservice: DropDownAPIService,
    protected dynamicDialogConfig: DynamicDialogConfig, protected translateService: TranslateService
  ) {
    super();
    this.taskSubscription = taskService.notifyTaskAfterSaveTnx$.subscribe(
      (taskObj) => {
        if (taskObj && this.isTaskSaveInitiated) {
          this.performTaskSubmit();
        }
      }
    );
  }
  dir: string = localStorage.getItem('langDir');
  form: FCCFormGroup;
  module: '';
  issueDate = new Date().toString();
  taskRequest: TaskSubmission = {};
  taskDetailsRequest: TaskDetails = {};
  bankUserRequest: BankUserDetails = {};
  companyUserRequest: ReceiverDetails = {};
  issuerRequest: IssuerDetails = {};
  entities = [];
  assigneeFlag = false;
  bankFlag = false;
  otherUserFlag = false;
  taskId;
  private userInfoMap: Map<string, TaskDailogUserData> = new Map();
  private userList: TaskDialogDropDown[] = [];
  taskObj;

  ngOnInit(): void {
    // set taskid for edit task. set empty for create task scenario
    if (this.dynamicDialogConfig.data) {
      this.taskObj = this.dynamicDialogConfig.data.task;
      this.taskId = this.taskObj.taskId;
    }
    this.initializeFormGroup();
    this.setBankList();
    this.setEntityList();
    if (this.form.get('assigneOptions')[FccGlobalConstant.PARAMS].options){
    this.form.get('assigneOptions').setValue(this.form.get('assigneOptions')[FccGlobalConstant.PARAMS].options[0].value);
    }
    this.issuerRequest.emailNotificationRequired = FccBusinessConstantsService.NO;
    this.bankUserRequest.emailNotificationRequired = 'N';
    this.activatedRoute.queryParams.subscribe((params) => {
      this.productCode = params[FccGlobalConstant.PRODUCT];
    });
    this.onClickAssigneOptions();
    this.bankPermission = this.commonService.getUserPermissionFlag('collaboration_add_public_task_for_bank');
    this.updateButtonCss();
    this.editTaskPopulation();
    this.commonService.addTitleBarCloseButtonAccessibilityControl();
    }

  initializeFormGroup() {
    this.formModelService.getSubSectionModelAPI().subscribe((model) => {
      const dialogmodel = model[FccGlobalConstant.TASK_MODEL];
      this.form = this.formControlService.getFormControls(dialogmodel);
    });
    this.form.addFCCValidators('mailIdFirst', Validators.compose([Validators.pattern(FccGlobalConstant.EMAIL_VALIDATION)]), 0);
    this.form.addFCCValidators('mailIdSecond', Validators.compose([Validators.pattern(FccGlobalConstant.EMAIL_VALIDATION)]), 0);
  }
  updateButtonCss(){
    if (this.dir === 'rtl'){
      this.form.get('create')[FccGlobalConstant.PARAMS].parentStyleClass = 'createButton-Parent createLeft';
      this.form.get('cancel')[FccGlobalConstant.PARAMS].parentStyleClass = 'createButton-Parent cancelLeft';
      this.form.get('descriptionOfTask')[FccGlobalConstant.PARAMS].styleClass = 'dirTaskDescription';
    }
  }
  onClickCancel() {
    this.dialogCloseRef.close();
  }

  // on click action of create button
  onClickCreate() {
    if (this.productCode && this.form.valid) { // temp safety check, will be removed
    // initiation after save, draft etc scenarios i.e, refId generated
    if (this.commonService.referenceId) {
      this.performTaskSubmit();
    } else {
      // initiation scenario if transaction not saved yet.
      // trigger a save and set api model entity
      // perform task submit after transaction is saved
      this.isTaskSaveInitiated = true;
      this.taskService.notifySaveTransactionfromTask$.next(true);
    }
  }
  }

  onClickAssigneOptions() {
    if (!this.isEdit()){
       this.resetRequestObj();
    }
    const val = this.form.get('assigneOptions').value;
    if (val === FccGlobalConstant.STRING_01) {
      this.onclickSelf();
    } else if (val === FccGlobalConstant.STRING_02) {
      this.onclickPublic();
    } else {
      this.onclickAssigned();
    }
  }

  // Assignee as public
  onclickPublic() {
    this.form.get('mailBoxFirst')[FccGlobalConstant.PARAMS].rendered = true;
    this.form.get('userOptions')[FccGlobalConstant.PARAMS].rendered = false;
    this.form.get('assignees')[FccGlobalConstant.PARAMS].rendered = false;
    this.form.get('mailBoxSecond')[FccGlobalConstant.PARAMS].rendered = false;
    this.form.get('mailIdSecond')[FccGlobalConstant.PARAMS].rendered = false;
    this.taskDetailsRequest.type = FccGlobalConstant.STRING_02;
    this.enableEntityField();
  }
  // Assignee as assigned
  onclickAssigned() {
    this.assigneeFlag = true;
    this.form.get('mailBoxFirst')[FccGlobalConstant.PARAMS].rendered = true;
    this.form.get('userOptions')[FccGlobalConstant.PARAMS].rendered = true;
    this.form.get('assignees')[FccGlobalConstant.PARAMS].rendered = true;
    this.form.get('assignees')[FccGlobalConstant.PARAMS].required = true;
    this.form.get('mailBoxSecond')[FccGlobalConstant.PARAMS].rendered = true;
    this.taskDetailsRequest.type = FccGlobalConstant.STRING_03;
    this.enableEntityField();
    this.onClickUserOptions();
    if (!this.bankPermission){
      this.form.get('userOptions')[FccGlobalConstant.PARAMS].disabled = true;
    }
  }

  // Assignee as self
  onclickSelf() {
    this.form.get('mailBoxFirst')[FccGlobalConstant.PARAMS].rendered = false;
    this.form.get('mailIdFirst')[FccGlobalConstant.PARAMS].rendered = false;
    this.form.get('entity')[FccGlobalConstant.PARAMS].rendered = false;
    this.form.get('userOptions')[FccGlobalConstant.PARAMS].rendered = false;
    this.form.get('assignees')[FccGlobalConstant.PARAMS].rendered = false;
    this.form.get('mailBoxSecond')[FccGlobalConstant.PARAMS].rendered = false;
    this.form.get('mailIdSecond')[FccGlobalConstant.PARAMS].rendered = false;
    this.taskDetailsRequest.type = FccGlobalConstant.STRING_01;
    this.enableEntityField();
  }

  onClickUserOptions() {
    const togglevalue = this.form.get('userOptions').value;
    this.form.get('mailBoxSecond').setValue('N');
    this.form.get('mailIdSecond').setValue('');
    this.form.get('mailIdSecond')[FccGlobalConstant.PARAMS].rendered = false;
    this.form.get('mailIdSecond')[FccGlobalConstant.PARAMS].readonly = false;
    this.form.get('assignees')[FccGlobalConstant.PARAMS].readonly = false;
    // To clear the task service bank when create is not happening
    if (!this.isTaskSaveInitiated && !this.commonService.referenceId){
      this.taskService.setTaskBank('');
    }
    if (togglevalue === FccBusinessConstantsService.NO) {
      this.otherUserFlag = true;
      this.bankFlag = false;
      this.populateAssignee();
      this.taskDetailsRequest.assignee = FccGlobalConstant.STRING_01;
    } else {
      this.bankFlag = true;
      this.otherUserFlag = false;
      this.populateAssignee();
      this.taskDetailsRequest.assignee = FccGlobalConstant.STRING_02;
    }
  }
  enableEntityField(){
    if (this.entities.length !== FccGlobalConstant.LENGTH_0) {
      this.form.get('entity')[FccGlobalConstant.PARAMS].rendered = true;
      this.form.get('entity')[FccGlobalConstant.PARAMS].required = true;
      if (this.taskService.getTaskEntity()){
        this.form.get('entity').patchValue(this.taskService.getTaskEntity());
        this.form.get('entity')[FccGlobalConstant.PARAMS].readonly = true;
      }
      if (this.entities.length === FccGlobalConstant.LENGTH_1){
        this.patchFieldValueAndParameters(this.form.get('entity'), this.entities[0].value, { readonly: true });
        this.multiBankService.setCurrentEntity(this.entities[0].value.name);
        this.taskService.setTaskEntity(this.entities[0].value);
      }
      // for draft and message to bank scenario
      if (this.taskService.getTnxResponseObj() && this.taskService.getTnxResponseObj().entity){
        this.patchFieldValueAndParameters(this.form.get('entity'),
        this.getTnxEntityObj(this.taskService.getTnxResponseObj().entity), { readonly: true });
      }
    }
  }
  setEntityList() {
    this.multiBankService.getEntityList().forEach((entity) => {
      this.entities.push(entity);
    });
    if (this.entities.length !== FccGlobalConstant.LENGTH_0) {
      this.patchFieldParameters(this.form.get('entity'), {
        options: this.entities
      });
  }

  }

  setBankList() {
    this.taskService.corporateBanks = [];
    this.multiBankService.getBankList().forEach((bank) => {
      const bankDetail: TaskDialogDropDown = {
        label: bank.label,
        value: {
          label: bank.label,
          value: bank.value,
        },
      };
      this.taskService.corporateBanks.push(bankDetail);
    });
  }

  onClickEntity(event: any) {
    if (event.value) {
      this.multiBankService.setCurrentEntity(event.value.name);
      this.taskService.setTaskEntity(event.value);
      // this.form.get('create')[FccGlobalConstant.PARAMS].btndisable = false;
      this.populateAssignee();
    }
  }

  // populate the dropdown values for assignee
  populateAssignee() {
    if (this.assigneeFlag && this.bankFlag) {
      this.populateBank();
    }
    if (this.assigneeFlag && this.otherUserFlag) {
      if (this.entities.length !== FccGlobalConstant.LENGTH_0 && this.taskService.getTaskEntity()){
      this.populateUser(); // To populate list of user
      }else if (this.form.get('entity')[FccGlobalConstant.PARAMS].rendered === false){
        this.populateUser();
      }
    }
  }

  populateBank() {
    this.patchFieldParameters(this.form.get('assignees'), { options: [] });
    if (this.taskService.corporateBanks.length === FccGlobalConstant.LENGTH_0) {
      this.setBankList();
    }
    const val = this.dropDownAPIservice.getInputDropdownValue(this.taskService.corporateBanks, 'assignees', this.form);
    this.patchFieldParameters(this.form.get('assignees'), { options: this.taskService.corporateBanks });
    this.form.get('assignees').setValue(val);
    if (this.taskService.getTaskBank()){
      this.patchFieldValueAndParameters(this.form.get('assignees'), this.taskService.getTaskBank(), { readonly: true });
      this.bankUserRequest.bankName = this.taskService.getTaskBank().label;
      this.bankUserRequest.bankShortName = this.taskService.getTaskBank().value;
    }else{
    this.onClickAssignees(this.taskService.corporateBanks[0]); // For Setting Default Post Object
    }
  }

  populateUser() {
    this.patchFieldParameters(this.form.get('assignees'), { options: [] });
    const curEntity = this.taskService.getTaskEntity() !== undefined ? this.taskService.getTaskEntity().shortName : '';
    this.taskService
      .getCollabUsers(this.productCode, curEntity)
      .subscribe(
        (res) => {
          this.setUserList(res);
          this.updateAssigneeDropdown();
        }
      );
  }

  setUserList(objs: any) {
    this.userList = [];
    Object.keys(objs.items).forEach((index) => {
      const reference = objs.items[index];
      const list: TaskDailogUserData = {
        loginId: reference.LOGINID,
        emailId: reference.EMAIL,
        name: reference.NAME
      };
      const userObj: TaskDialogDropDown = {
        label: reference.NAME,
        value: {
          label: reference.NAME,
          value: reference.ID,
        },
      };
      this.userList.push(userObj);
      this.userInfoMap.set(reference.ID, list);
    });
    this.patchFieldParameters(this.form.get('assignees'), {
      options: this.userList,
    });
    this.form.updateValueAndValidity();
  }

  onClickAssignees(event: any) {
    if (event.value) {
      if (this.bankFlag) {
        this.multiBankService.setCurrentBank(event.value);
        this.bankUserRequest.bankName = event.value.label;
        this.bankUserRequest.bankShortName = event.value.value;
        this.taskService.setTaskBank(event.value);
      } else {
        const userDetails = this.userInfoMap.get(event.value.value);
        this.companyUserRequest.loginId = userDetails.loginId;
        this.companyUserRequest.userId = event.value.value;
        if (userDetails.emailId !== '') {
          this.companyUserRequest.email = userDetails.emailId;
          this.patchFieldValueAndParameters(this.form.get('mailIdSecond'), userDetails.emailId, { readonly: true });
        }
      }
    }
  }

  onClickMailBoxFirst(event: any) {
    if (event.checked === true) {
      this.form.get('mailIdFirst')[FccGlobalConstant.PARAMS].rendered = true;
      this.issuerRequest.emailNotificationRequired = FccBusinessConstantsService.YES;
      if (this.commonService.currentUserMail){
      this.patchFieldValueAndParameters(this.form.get('mailIdFirst'), this.commonService.currentUserMail, { readonly: true });
      }
      if (this.entities){
        this.form.get('space')[FccGlobalConstant.PARAMS].rendered = true;
      }
    } else {
      this.form.get('mailIdFirst')[FccGlobalConstant.PARAMS].rendered = false;
      this.issuerRequest.emailNotificationRequired = FccBusinessConstantsService.NO;
      this.form.get('space')[FccGlobalConstant.PARAMS].rendered = false;
    }
    if (this.isEdit()){

    }
  }

  onClickMailBoxSecond(event: any) {
    if (event.checked === true) {
      this.form.get('mailIdSecond')[FccGlobalConstant.PARAMS].rendered = true;
      if (this.bankFlag){
      this.bankUserRequest.emailNotificationRequired = FccBusinessConstantsService.YES;
      } else{
      this.companyUserRequest.emailNotificationRequired = FccBusinessConstantsService.YES;
      }
    } else {
      this.form.get('mailIdSecond')[FccGlobalConstant.PARAMS].rendered = false;
      this.bankUserRequest.emailNotificationRequired = FccBusinessConstantsService.NO;
      this.companyUserRequest.emailNotificationRequired = FccBusinessConstantsService.NO;
    }
  }

  private setRequestPayload() {
    // set task user inputs
    this.taskDetailsRequest.name = this.form.get('titleOfTask').value;
    this.taskDetailsRequest.description = this.form.get('descriptionOfTask').value;
    if (this.taskService.getTodoListId()) {
      this.taskDetailsRequest.toDoListId = this.taskService.getTodoListId();
    }
    this.taskDetailsRequest.issueDate = this.issueDate;
    this.issuerRequest.email = this.form.get('mailIdFirst').value;
    // set taskdetails object
    this.taskRequest.task = this.taskDetailsRequest;

    // set bankuser object
    if (this.taskDetailsRequest.type === FccGlobalConstant.STRING_03 && this.taskDetailsRequest.assignee === FccGlobalConstant.STRING_02){
      this.bankUserRequest.email = this.form.get('mailIdSecond').value;
      this.taskRequest.bankUser = this.bankUserRequest;
    }
    // set company user object
    if (this.taskDetailsRequest.type === FccGlobalConstant.STRING_03 && this.taskDetailsRequest.assignee === FccGlobalConstant.STRING_01){
      this.companyUserRequest.email = this.form.get('mailIdSecond').value;
      this.taskRequest.companyUser = this.companyUserRequest;
    }
    // set issue user object
    this.taskRequest.issuer = this.issuerRequest;
  }

  // Post Task API call
  protected postCreate() {
    this.taskService.createTask(this.taskRequest).subscribe(
      (res) => {
        // TODO revisit
        this.taskService.setTodoListId(res.toDoListId);
        this.taskService.refreshTaskListing$.next(true);
        this.dialogCloseRef.close();
      },
      () => {
        this.dialogCloseRef.close();
      }
    );
  }

  // update task api call
  protected putEditTask() {
    this.taskService.updateTask(this.taskRequest, this.taskId).subscribe(
      (res) => {
        // TODO revisit
        this.taskService.setTodoListId(res.toDoListId);
        this.taskService.refreshTaskListing$.next(true);
        this.dialogCloseRef.close();
      },
      () => {
        this.dialogCloseRef.close();
      }
    );
  }

  resetRequestObj(){
    this.resetFormValues();
    this.taskRequest = {};
    this.taskDetailsRequest = {};
    this.bankUserRequest = {};
    this.companyUserRequest = {};
    this.issuerRequest = {};
  }

  resetFormValues(){
  this.form.get('titleOfTask').setValue('');
  this.form.get('descriptionOfTask').reset();
  this.form.get('descriptionOfTask')[FccGlobalConstant.PARAMS].enteredCharCount = FccGlobalConstant.LENGTH_0;
  this.form.get('mailBoxFirst').setValue(FccBusinessConstantsService.NO);
  this.form.get('mailIdFirst').setValue('');
  this.form.get('mailIdFirst')[FccGlobalConstant.PARAMS].rendered = false;
  this.form.get('mailBoxSecond').setValue(FccBusinessConstantsService.NO);
  this.form.get('mailIdSecond').setValue('');
  this.form.get('mailIdSecond')[FccGlobalConstant.PARAMS].rendered = false;
  this.form.get('userOptions').setValue(FccBusinessConstantsService.NO);
  this.form.get('assignees').setValue('');
  this.form.get('assignees')[FccGlobalConstant.PARAMS].required = false;
  this.form.get('assignees').setErrors(null);
  this.form.get('space')[FccGlobalConstant.PARAMS].rendered = false;
  if (!this.isTaskSaveInitiated && !this.commonService.referenceId){
    this.form.get('entity').setValue('');
    this.form.get('entity')[FccGlobalConstant.PARAMS].required = false;
    this.form.get('entity')[FccGlobalConstant.PARAMS].readonly = false;
    this.taskService.setTaskEntity('');
  }
  }

  ngOnDestroy() {
    this.userList = [];
    this.taskId = undefined;
    this.taskSubscription.unsubscribe();
    if (!this.isTaskSaveInitiated && !this.commonService.referenceId){
      this.taskService.setTaskEntity('');
      this.taskService.setTaskBank('');
    }
  }

  private performTaskSubmit() {
    this.taskDetailsRequest.id = this.commonService.referenceId;
    this.taskDetailsRequest.eventId = this.commonService.eventId;
    this.setRequestPayload();
    this.isEdit() ? this.putEditTask() : this.postCreate();
    this.isTaskSaveInitiated = false;
  }
/* To check whether task is created or not */
private isEdit() {
  return this.taskId ? true : false;
}

private editTaskPopulation(){
if (this.isEdit() && this.dynamicDialogConfig.data.task){
  this.form.get('create')[FccGlobalConstant.PARAMS].label = `${this.translateService.instant('update')}`;
  this.form.get('assigneOptions').setValue(this.taskObj.type);
  this.onClickAssigneOptions();
  this.form.get('titleOfTask').setValue(this.taskObj.name);
  this.form.get('descriptionOfTask').setValue(this.taskObj.description);
  if (this.taskObj.issuerEmailNotify === FccBusinessConstantsService.YES){
    this.form.get('mailBoxFirst').setValue(FccBusinessConstantsService.YES);
    this.form.get('space')[FccGlobalConstant.PARAMS].rendered = true;
    this.patchFieldValueAndParameters(this.form.get('mailIdFirst'), this.taskObj.issuerMail, { rendered : true });
    this.form.get('mailIdFirst')[FccGlobalConstant.PARAMS].readonly = true;
}
  if (this.taskObj.assigneeType === FccGlobalConstant.STRING_01){
  this.otherUserFlag = true;
  this.bankFlag = false;
}
  if (this.taskObj.assigneeType === FccGlobalConstant.STRING_02){
  this.otherUserFlag = false;
  this.bankFlag = true;
  }
}
}
   /* Edit Scenario  for assignee dropdown*/
   updateAssigneeDropdown(){
    if (this.isEdit()){
      // Incase of switch flag value changes but current task object assignee type remains same until the task is updated
      if (/*this.taskObj.assigneeType === FccGlobalConstant.STRING_01 && */this.otherUserFlag === true){
        this.form.get('userOptions').setValue(FccBusinessConstantsService.NO);
        this.companyUserRequest.emailNotificationRequired = this.taskObj.destOtherUserEmailNotify;
        this.companyUserRequest.loginId = this.taskObj.destLoginId;
        this.companyUserRequest.userId = this.taskObj.destUserId;
        this.patchFieldParameters(this.form.get('assignees'), {
          options: this.userList
        });
        this.form.get('assignees').setValue(this.getUserObj(this.userInfoMap.get(this.taskObj.destUserId).name));
      }else if (this.bankFlag === true){
        this.form.get('userOptions').setValue(FccBusinessConstantsService.YES);
        this.bankUserRequest.emailNotificationRequired = this.taskObj.destBankEmailNotify;
        this.populateBank();
      }
      if (this.taskObj.destBankEmailNotify === FccBusinessConstantsService.YES ||
         this.taskObj.destOtherUserEmailNotify === FccBusinessConstantsService.YES){
        this.form.get('mailBoxSecond').setValue(FccBusinessConstantsService.YES);
        this.patchFieldValueAndParameters(this.form.get('mailIdSecond'), this.taskObj.destinationMail, { rendered : true });
        this.form.get('mailIdSecond')[FccGlobalConstant.PARAMS].readonly = true;
      }
  }
  }
/* To update current user object in dropdown*/
getUserObj(uname: any){
  let unameObj;
  for (let i = FccGlobalConstant.LENGTH_0; i < this.userList.length; i++){
    if (this.userList[i].label === uname){
      unameObj = this.userList[i].value;
      break;
    }
 }
  return unameObj;
}
/* To update entity object */
getTnxEntityObj(tnxEntity: any){
  let tnxEntityObj;
  for (let i = FccGlobalConstant.LENGTH_0; i < this.entities.length; i++){
    if (this.entities[i].value.shortName === tnxEntity){
      tnxEntityObj = this.entities[i].value;
      break;
    }
 }
  this.taskService.setTaskEntity(tnxEntityObj);
  this.multiBankService.setCurrentEntity(tnxEntityObj.name);
  return tnxEntityObj;
}
}

export interface TaskDailogUserData {
  loginId: string;
  emailId: string;
  name: string;
}

export interface TaskDialogDropDown {
  label: string;
  value: {
    label: string;
    value?: string;
  };
}
