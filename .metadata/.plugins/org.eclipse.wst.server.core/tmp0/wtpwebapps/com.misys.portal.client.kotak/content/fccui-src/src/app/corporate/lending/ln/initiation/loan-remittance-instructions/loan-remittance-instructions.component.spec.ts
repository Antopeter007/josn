import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { LoanRemittanceInstructionsComponent } from './loan-remittance-instructions.component';

describe('LoanRemittanceInstructionsComponent', () => {
  let component: LoanRemittanceInstructionsComponent;
  let fixture: ComponentFixture<LoanRemittanceInstructionsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ LoanRemittanceInstructionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoanRemittanceInstructionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
