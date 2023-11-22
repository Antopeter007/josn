import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SiApplicantBeneficiaryDetailsComponent } from './si-applicant-beneficiary-details.component';

describe('SiApplicantBeneficiaryDetailsComponent', () => {
  let component: SiApplicantBeneficiaryDetailsComponent;
  let fixture: ComponentFixture<SiApplicantBeneficiaryDetailsComponent>;

  // beforeEach(async(() => {
  //   TestBed.configureTestingModule({
  //     declarations: [ SiApplicantBeneficiaryDetailsComponent ]
  //   })
  //   .compileComponents();
  // }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SiApplicantBeneficiaryDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
