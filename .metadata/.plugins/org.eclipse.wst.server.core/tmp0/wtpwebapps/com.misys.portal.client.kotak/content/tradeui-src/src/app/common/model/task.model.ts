import { Comment } from './comment.model';

export class Task {
    taskId: string;
    description: string;
    emailNotification: string;
    email: string;
    issueUserId: string;
    issueUserLoginId: string;
    issueUserFirstName: string;
    issueUserLastName: string;
    issueCompanyAbbvName: string;
    issueCompanyName: string;
    issueDate: string;
    inputDateAndTime: string;
    destUserId: string;
    destUserFirstName: string;
    destUserLastName: string;
    destUserLoginId: string;
    destUserEmailNotif: string;
    destUserEmail: string;
    destUserEmailSent: string;
    destCompanyAbbvName: string;
    destCompanyName: string;
    destCompanyEmailNotif: string;
    destCompanyEmail: string;
    destCompanyEmailSent: string;
    type: string;
    assigneeType: string;
    performed: string;
    frozen: string;
    todoListId: string;
    comments: Comment[];
    constructor() {}
}
