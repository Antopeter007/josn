import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { BankCommonApplicantBeneDetailsComponent } from './bank-common-applicant-bene-details.component';

describe('BankCommonApplicantBeneDetailsComponent', () => {
  let component: BankCommonApplicantBeneDetailsComponent;
  let fixture: ComponentFixture<BankCommonApplicantBeneDetailsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ BankCommonApplicantBeneDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BankCommonApplicantBeneDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
