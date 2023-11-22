import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmationGuardDialogComponent } from './confirmation-guard-dialog.component';

describe('ConfirmationGuardDialogComponent', () => {
  let component: ConfirmationGuardDialogComponent;
  let fixture: ComponentFixture<ConfirmationGuardDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConfirmationGuardDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmationGuardDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
