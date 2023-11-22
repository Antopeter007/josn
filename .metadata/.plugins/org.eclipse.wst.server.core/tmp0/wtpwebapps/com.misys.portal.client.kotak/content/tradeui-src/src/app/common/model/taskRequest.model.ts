import { Constants } from '../constants';
import { Task } from './task.model';

interface TaskDetail {
    type: string;
    assignee: string;
    description: string;
    id: string;
    eventId: string;
    issueDate: string;
    toDoListId: string;
    inputDateAndTime: string;
}

interface Issuer {
    userId: string;
    issueCompanyShortName: string;
    emailNotificationRequired: string;
    email: string;
}

interface CounterpartyUser {
    companyName: string;
    companyShortName: string;
    emailNotificationRequired: string;
    email: string;
}

interface BankUser {
    bankName: string;
    bankShortName: string;
    emailNotificationRequired: string;
    email: string;
}

interface CompanyUser {
    email: string;
    emailNotificationRequired: string;
    loginId: string;
    userId: string;
}

export class TaskRequest {
    public task: TaskDetail;
    public issuer: Issuer;
    public counterpartyUser: CounterpartyUser;
    public bankUser: BankUser;
    public companyUser: CompanyUser;

    public constructor(task: Task, refId: string, tnxId: string) {
        this.mergeTaskDetail(task, refId, tnxId);
        if (task.type ===  Constants.CODE_03) {
        if (task.assigneeType === Constants.CODE_02) {
        this.mergeBankUser(task);
        } else if (task.assigneeType === Constants.CODE_01) {
        this.mergeCompanyUser(task);
        } else if (task.assigneeType === Constants.CODE_03) {
        this.mergeCounterPartyUser(task);
        }
        }
    }

    public merge(init: Partial<TaskRequest>) {
        Object.assign(this, init);
    }

    public mergeTaskDetail(task: Task, ref: string, tnxId: string) {
        this.task = {} as TaskDetail;
        this.task.description = task.description;
        this.task.type = task.type;
        this.task.eventId = tnxId;
        this.task.id = ref;
        if (task.type ===  Constants.CODE_03) {
        this.task.assignee = task.assigneeType;
        }
        this.task.toDoListId = task.todoListId;
        this.task.issueDate = task.issueDate;
        this.task.inputDateAndTime = task.inputDateAndTime;
        this.issuer = {} as Issuer;
        this.issuer.email = task.email;
        this.issuer.emailNotificationRequired = task.emailNotification;
        this.issuer.issueCompanyShortName = task.issueCompanyAbbvName;
        this.issuer.userId = task.issueUserId;
      }

    public mergeBankUser(task: Task) {
        this.bankUser = {} as BankUser;
        this.bankUser.bankName = task.destCompanyName;
        this.bankUser.bankShortName = task.destCompanyAbbvName;
        this.bankUser.emailNotificationRequired = task.destCompanyEmailNotif;
        this.bankUser.email = task.destCompanyEmail;
    }

    public mergeCompanyUser(task: Task) {
        this.companyUser = {} as CompanyUser;
        this.companyUser.email = task.destUserEmail;
        this.companyUser.emailNotificationRequired = task.destUserEmailNotif;
        this.companyUser.userId = task.destUserId;
        this.companyUser.loginId = task.destUserLoginId;
    }

    public mergeCounterPartyUser(task: Task) {
        this.counterpartyUser = {} as CounterpartyUser;
        this.counterpartyUser.companyName = '';
        this.counterpartyUser.companyShortName = '';
        this.counterpartyUser.emailNotificationRequired = Constants.NO;
        this.counterpartyUser.email = '';
    }

}
