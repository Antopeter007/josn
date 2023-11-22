import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LiApplicantBeneficiaryComponent } from './li-applicant-beneficiary.component';

describe('LiApplicantBeneficiaryComponent', () => {
  let component: LiApplicantBeneficiaryComponent;
  let fixture: ComponentFixture<LiApplicantBeneficiaryComponent>;

  // beforeEach(async(() => {
  //   TestBed.configureTestingModule({
  //     declarations: [ LiApplicantBeneficiaryComponent ]
  //   })
  //   .compileComponents();
  // }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LiApplicantBeneficiaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
