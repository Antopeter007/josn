import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SgApplicantBeneficiaryComponent } from './sg-applicant-beneficiary.component';

describe('SgApplicantBeneficiaryComponent', () => {
  let component: SgApplicantBeneficiaryComponent;
  let fixture: ComponentFixture<SgApplicantBeneficiaryComponent>;

  // beforeEach(async(() => {
  //   TestBed.configureTestingModule({
  //     declarations: [ SgApplicantBeneficiaryComponent ]
  //   })
  //   .compileComponents();
  // }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SgApplicantBeneficiaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
