import { Task } from './task.model';

export class TodoList {
    todoListId: string;
    name: string;
    description: string;
    issueDate: string;
    issueUserId: string;
    issueCompanyAbbvName: string;
    type: string;
    tasks: Task[];
    constructor() {}
}
