import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpecialPaymentForBeneficiaryComponent } from './special-payment-for-beneficiary.component';

describe('SpecialPaymentForBeneficiaryComponent', () => {
  let component: SpecialPaymentForBeneficiaryComponent;
  let fixture: ComponentFixture<SpecialPaymentForBeneficiaryComponent>;

  // beforeEach(async(() => {
  //   TestBed.configureTestingModule({
  //     declarations: [ SpecialPaymentForBeneficiaryComponent ]
  //   })
  //   .compileComponents();
  // }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SpecialPaymentForBeneficiaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
