import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CollaborationUsersDialogComponent } from './collaboration-users.dialog.component';

describe('CollaborationUsersDialogComponent', () => {
  let component: CollaborationUsersDialogComponent;
  let fixture: ComponentFixture<CollaborationUsersDialogComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CollaborationUsersDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CollaborationUsersDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
