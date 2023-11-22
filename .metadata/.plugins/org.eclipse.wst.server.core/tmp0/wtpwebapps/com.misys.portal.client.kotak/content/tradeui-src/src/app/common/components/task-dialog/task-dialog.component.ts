import { CollaborationUsersDialogComponent } from './../collaboration-users.dialog/collaboration-users.dialog.component';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ConfirmationService, DialogService, DynamicDialogConfig, DynamicDialogRef } from 'primeng';
import { IUCommonDataService } from '../../../trade/iu/common/service/iuCommonData.service';
import { Constants } from '../../constants';
import { Task } from '../../model/task.model';
import { CommonDataService } from '../../services/common-data.service';
import { CommonService } from '../../services/common.service';
import { validateSwiftCharSet } from '../../validators/common-validator';
import { ValidationService } from '../../validators/validation.service';
import { DatePipe } from '@angular/common';
import { User } from '../../model/user.model';
import { TranslateService } from '@ngx-translate/core';
import { TaskRequest } from '../../model/taskRequest.model';

@Component({
  selector: 'fcc-common-task-dialog',
  templateUrl: './task-dialog.component.html',
  styleUrls: ['./task-dialog.component.scss'],
  providers: [DialogService]
})
export class TaskDialogComponent implements OnInit {
  taskDetailsForm: UntypedFormGroup;
  task: Task;
  eventType: string;
  showAssignee = false;
  destUserDetail = new User();
  taskIndex: any;
  entityExist: boolean;
  disableOK = false;

  constructor(public fb: UntypedFormBuilder, public dialogRef: DynamicDialogRef,  public config: DynamicDialogConfig,
              public commonService: CommonService, public validationService: ValidationService,
              public commonDataService: IUCommonDataService, public commonData: CommonDataService,
              public datePipe: DatePipe, public translate: TranslateService, public confirmationService: ConfirmationService,
              public dialogService: DialogService, public changeDetectorRef: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.task =  this.config.data.task;
    this.eventType = this.config.data.eventType;
    this.taskIndex = this.config.data.taskIndex;
    this.entityExist = this.config.data.entityExist;
    this.taskDetailsForm = this.fb.group({
      description: ['', [Validators.required, Validators.maxLength(Constants.LENGTH_200), validateSwiftCharSet(Constants.X_CHAR)]],
      emailNotification: [''],
      email: [''],
      type: [''],
      assigneeType: [''],
      destUserLoginId: [''],
      destUserEmailNotif: [''],
      destUserEmail: [''  ]
    });
    if (this.eventType === Constants.MODE_DRAFT) {
    this.initAllFields();
    } else if (this.config.data.taskType === Constants.PUBLIC_TASK) {
      this.taskDetailsForm.get(`type`).setValue(Constants.CODE_02);
    }
  }
  initAllFields() {
    this.taskDetailsForm.patchValue({
      description : this.task.description,
      emailNotification : this.commonDataService.getCheckboxBooleanValues(this.task.emailNotification),
      email : this.task.email,
      type : this.task.type,
      assigneeType : this.task.assigneeType,
      destUserLoginId : (this.task.assigneeType === Constants.CODE_01 ? this.task.destUserLoginId : this.task.destCompanyName),
      destUserEmailNotif : this.commonDataService.getCheckboxBooleanValues((this.task.assigneeType === Constants.CODE_01 ?
       this.task.destUserEmailNotif : this.task.destCompanyEmailNotif)),
      destUserEmail : (this.task.assigneeType === Constants.CODE_01 ? this.task.destUserEmail : this.task.destCompanyEmail),
    });
    if ( this.task.type === Constants.CODE_03) {
      this.showAssignee = true;
    }
    if (this.task.assigneeType === Constants.CODE_01) {
      this.destUserDetail.EMAIL = this.task.destUserEmail;
      this.destUserDetail.FIRSTNAME = this.task.destUserFirstName;
      this.destUserDetail.LASTNAME = this.task.destUserLastName;
      this.destUserDetail.ID = this.task.destUserId;
      this.destUserDetail.NAME = this.task.destUserLoginId;
    }
  }
  onChangeTaskType(type) {
    this.taskDetailsForm.get(`destUserLoginId`).clearValidators();
    this.taskDetailsForm.get(`destUserLoginId`).setValue('');
    this.taskDetailsForm.get(`destUserEmailNotif`).setValue('');
    this.taskDetailsForm.get(`assigneeType`).setValue('');
    this.showAssignee = false;
    if (type === Constants.CODE_03) {
      if (!this.entityExist) {
        let message = '';
        let dialogHeader = '';
        this.translate.get('WARNING_TITLE').subscribe((value: string) => {
          dialogHeader = value;
        });
        this.translate.get('ENTITY_ABSENT_WARNING').subscribe((value: string) => {
          message = value;
        });
        this.confirmationService.confirm({
          message,
          header: dialogHeader,
          icon: 'pi pi-exclamation-triangle',
          key: 'entityWarningDialog',
          rejectVisible: false,
          acceptLabel: this.commonService.getTranslation('USER_ACTION_OK'),
          accept: () => {
          }
        });
      }
      this.showAssignee = true;
      this.taskDetailsForm.get(`assigneeType`).patchValue(Constants.CODE_01);
      this.taskDetailsForm.get(`destUserLoginId`).setValidators(Validators.required);
    }
    this.taskDetailsForm.get(`destUserEmailNotif`).updateValueAndValidity();
    this.taskDetailsForm.get(`assigneeType`).updateValueAndValidity();
    this.taskDetailsForm.get(`destUserLoginId`).updateValueAndValidity();
    this.changeDetectorRef.detectChanges();
  }
  onCheckEmailNotification(value, type) {
    const controlName = (type === Constants.CODE_01 ? 'email' : 'destUserEmail');
    this.taskDetailsForm.get(controlName).setValue('');
    const email = (type === Constants.CODE_01 ? this.commonService.getSessionData().userEmail : this.destUserDetail.EMAIL);
    this.taskDetailsForm.get(controlName).clearValidators();
    if (value && (type === Constants.CODE_01 || this.taskDetailsForm.get(`assigneeType`).value === Constants.CODE_01)) {
      this.taskDetailsForm.get(controlName).setValidators(Validators.required);
      this.taskDetailsForm.get(controlName).setValue(email);
    }
    this.taskDetailsForm.get(controlName).updateValueAndValidity();
  }
  onChangeAssigneeType(type) {
    this.taskDetailsForm.get(`destUserLoginId`).setValue('');
    this.taskDetailsForm.get(`destUserEmailNotif`).setValue('');
    this.taskDetailsForm.get(`destUserEmail`).setValue('');
    if (type === Constants.CODE_02) {
      this.taskDetailsForm.get(`destUserLoginId`).setValue(this.commonService.getMainBankName());
      this.task.destCompanyAbbvName = this.commonService.getMainBankAbbvName();
    }
    this.taskDetailsForm.get(`destUserLoginId`).updateValueAndValidity();
    this.taskDetailsForm.get(`destUserEmailNotif`).updateValueAndValidity();
    this.taskDetailsForm.get(`destUserEmail`).updateValueAndValidity();
  }

  selectUser() {
      const ref = this.dialogService.open(CollaborationUsersDialogComponent, {
        header: this.commonService.getTranslation('TABLE_SUMMARY_ENTITIES_LIST'),
        width: '1000px',
        height: '400px',
        contentStyle: {overflow: 'auto'}
      });
      ref.onClose.subscribe((user: User) => {
        if (user) {
          this.taskDetailsForm.get('destUserLoginId').setValue(user.LOGINID);
          this.taskDetailsForm.get('destUserEmail').setValue(user.EMAIL);
          this.destUserDetail.EMAIL = user.EMAIL;
          this.destUserDetail.FIRSTNAME = user.FIRSTNAME;
          this.destUserDetail.LASTNAME = user.LASTNAME;
          this.destUserDetail.ID = user.ID;
          this.destUserDetail.NAME = user.NAME;
        }
      });
  }
  saveTask() {
    let taskRequest;
    this.taskDetailsForm.markAllAsTouched();
    if (this.taskDetailsForm.valid) {
    this.disableOK = true;
    this.transformTask();
    if (this.commonData.getProductCode() === Constants.PRODUCT_CODE_IU) {
      taskRequest = new TaskRequest(this.task, this.commonDataService.getRefId(), this.commonDataService.getTnxId());
    } else if (this.commonData.getProductCode() === Constants.PRODUCT_CODE_RU) {
      taskRequest = new TaskRequest(this.task, this.commonData.getRefId(), this.commonData.getTnxId());
    }
    if (this.eventType === Constants.MODE_DRAFT) {
      this.commonService.editTask(
        taskRequest, this.task.taskId).subscribe(
          data => {
              (this.task.type !== Constants.CODE_01  ? this.commonService.editPublicTask(this.task, this.taskIndex) :
              this.commonService.editPrivateTask(this.task, this.taskIndex));
              this.dialogRef.close({event: Constants.SUCCESS});
          }
        );
    } else {
    this.commonService.saveTask(
      taskRequest).subscribe(
        data => {
          this.task.taskId = data.taskId;
          this.task.todoListId =  data.toDoListId;
          if (!(this.commonService.getTnxToDoListId() != null && this.commonService.getTnxToDoListId() !== '')) {
            this.commonService.setTnxToDoListId(data.toDoListId);
          }
          (this.task.type !== Constants.CODE_01  ? this.commonService.addPublicTask(this.task) :
             this.commonService.addPrivateTask(this.task));
          this.dialogRef.close({event: Constants.SUCCESS});
          }
        );
      }
    }
  }
  transformTask() {
    const currentDate = this.datePipe.transform(new Date(), Constants.TIMESTAMP_FORMAT);
    this.task.description = this.taskDetailsForm.get(`description`).value;
    const session = this.commonService.getSessionData();
    this.task.issueUserLoginId = session.username;
    this.task.issueCompanyName = session.companyName;
    this.task.issueCompanyAbbvName = session.companyAbbvName;
    this.task.issueDate = currentDate;
    if (this.commonService.getboInpDttm() != null && this.commonService.getboInpDttm() !== '') {
      this.task.inputDateAndTime = this.commonService.getboInpDttm();
    } else {
      this.task.inputDateAndTime = '';
    }
    this.task.issueUserFirstName = session.userFirstName;
    this.task.issueUserLastName = session.userLastName;
    this.task.issueUserId = session.userId;
    if (this.commonService.getTnxToDoListId() != null && this.commonService.getTnxToDoListId() !== '') {
      this.task.todoListId = this.commonService.getTnxToDoListId();
    } else {
      this.task.todoListId = '';
    }
    if (this.task.type !== Constants.CODE_01 ) {
      this.task.emailNotification = this.commonDataService.getCheckboxFlagValues(this.taskDetailsForm.get(`emailNotification`).value);
      this.task.email = this.taskDetailsForm.get(`email`).value;
      this.task.type = this.taskDetailsForm.get(`type`).value;
      if (this.task.type === Constants.CODE_02) {
        this.task.destCompanyAbbvName = session.companyAbbvName;
        this.task.destCompanyName = session.companyName;
      } else {
        this.task.assigneeType = this.taskDetailsForm.get(`assigneeType`).value;
        if (this.task.assigneeType === Constants.CODE_02) {
          this.task.destCompanyEmailNotif =
          this.commonDataService.getCheckboxFlagValues(this.taskDetailsForm.get(`destUserEmailNotif`).value);
          this.task.destCompanyName = this.taskDetailsForm.get(`destUserLoginId`).value;
          this.task.destCompanyAbbvName = this.commonService.getMainBankAbbvName();
          this.task.destCompanyEmail = this.taskDetailsForm.get(`destUserEmail`).value;
        } else {
          this.task.destCompanyAbbvName = session.companyAbbvName;
          this.task.destCompanyName = session.companyName;
          this.task.destUserEmail = this.destUserDetail.EMAIL;
          this.task.destUserEmailNotif = this.commonDataService.getCheckboxFlagValues(this.taskDetailsForm.get(`destUserEmailNotif`).value);
          this.task.destUserFirstName = this.destUserDetail.FIRSTNAME;
          this.task.destUserLastName = this.destUserDetail.LASTNAME;
          this.task.destUserId = this.destUserDetail.ID;
          this.task.destUserLoginId = this.taskDetailsForm.get(`destUserLoginId`).value;
        }
      }
    }

  }
}
