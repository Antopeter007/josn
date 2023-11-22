import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { BankApplicantBeneDetailsComponent } from './bank-applicant-bene-details.component';

describe('BankApplicantBeneDetailsComponent', () => {
  let component: BankApplicantBeneDetailsComponent;
  let fixture: ComponentFixture<BankApplicantBeneDetailsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ BankApplicantBeneDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BankApplicantBeneDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
