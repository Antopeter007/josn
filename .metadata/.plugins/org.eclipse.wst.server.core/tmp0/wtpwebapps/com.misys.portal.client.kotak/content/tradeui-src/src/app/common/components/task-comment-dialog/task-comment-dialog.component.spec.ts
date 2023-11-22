import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { TaskCommentDialogComponent } from './task-comment-dialog.component';

describe('TaskCommentDialogComponent', () => {
  let component: TaskCommentDialogComponent;
  let fixture: ComponentFixture<TaskCommentDialogComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ TaskCommentDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TaskCommentDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
