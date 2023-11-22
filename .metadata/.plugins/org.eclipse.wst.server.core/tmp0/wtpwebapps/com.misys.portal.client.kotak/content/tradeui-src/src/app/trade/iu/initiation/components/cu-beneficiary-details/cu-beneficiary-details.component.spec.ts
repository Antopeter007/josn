import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CuBeneficiaryDetailsComponent } from './cu-beneficiary-details.component';

describe('CuBeneficiaryDetailsComponent', () => {
  let component: CuBeneficiaryDetailsComponent;
  let fixture: ComponentFixture<CuBeneficiaryDetailsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CuBeneficiaryDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CuBeneficiaryDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
