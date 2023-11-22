import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SessionWarningDialogComponent } from './session-warning-dialog.component';

describe('SessionWarningDialogComponent', () => {
  let component: SessionWarningDialogComponent;
  let fixture: ComponentFixture<SessionWarningDialogComponent>;

  // beforeEach(async(() => {
  //   TestBed.configureTestingModule({
  //     declarations: [ SessionWarningDialogComponent ]
  //   })
  //   .compileComponents();
  // }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SessionWarningDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
