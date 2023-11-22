import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateNewLoanDialogComponent } from './create-new-loan-dialog.component';

describe('CreateNewLoanDialogComponent', () => {
  let component: CreateNewLoanDialogComponent;
  let fixture: ComponentFixture<CreateNewLoanDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateNewLoanDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateNewLoanDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
