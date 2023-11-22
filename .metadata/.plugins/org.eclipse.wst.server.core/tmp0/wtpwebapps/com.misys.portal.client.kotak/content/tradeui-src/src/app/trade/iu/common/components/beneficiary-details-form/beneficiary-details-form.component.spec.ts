import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { IUCommonBeneficiaryDetailsComponent } from './beneficiary-details-form.component';

describe('ApplicantDetailsFormComponent', () => {
  let component: IUCommonBeneficiaryDetailsComponent;
  let fixture: ComponentFixture<IUCommonBeneficiaryDetailsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ IUCommonBeneficiaryDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IUCommonBeneficiaryDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
