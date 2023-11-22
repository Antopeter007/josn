/**
 * Task type for listing of tasks
 *
 */
export interface Task {
  name?: string;
  date?: string;
  todoListId?: string;
  commentLength?: string;
  taskId?: string;
  type?: string;
  description?: string;
  performed?;
  comment?: Comment[];
  issuerName?: string;
  assignees?: string;
  mailBoxFirst?: string;
  mailIdFirst?: string;
  assigneeType?: string;
  destinationMail?: string;
  bankName?: string;
  bankShortName?: string;
  destUserId?: string;
  destLoginId?: string;
  destBankEmailNotify?: string;
  destOtherUserEmailNotify?: string;
  issuerMail?: string;
  issuerId?: string;
  canEdit?: boolean;
  issuerEmailNotify?: string;
}

/**
 * todoList type
 *
 */
export interface TodoList {
  date?: string;
  type?: string;
  userId?: string;
  companyAbbvName?: string;
  tasks?: Task[];


}

/**
 * Task comment type
 */
export interface Comment {
  descriptionOfComment?: string;
  fullName?: string;
  issueDate?: string;
}

export interface CommentsForPost {
  description?: string;
  taskId?: string;
}

export interface TaskStatus {
  isComplete: boolean;
}

export interface TaskInput {
  task?: Task;
}
