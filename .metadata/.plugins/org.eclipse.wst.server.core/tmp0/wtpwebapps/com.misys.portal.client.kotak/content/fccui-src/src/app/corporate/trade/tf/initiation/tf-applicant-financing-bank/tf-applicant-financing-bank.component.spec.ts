import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TfApplicantFinancingBankComponent } from './tf-applicant-financing-bank.component';

describe('TfApplicantFinancingBankComponent', () => {
  let component: TfApplicantFinancingBankComponent;
  let fixture: ComponentFixture<TfApplicantFinancingBankComponent>;

  // beforeEach(async(() => {
  //   TestBed.configureTestingModule({
  //     declarations: [ TfApplicantFinancingBankComponent ]
  //   })
  //   .compileComponents();
  // }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TfApplicantFinancingBankComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
