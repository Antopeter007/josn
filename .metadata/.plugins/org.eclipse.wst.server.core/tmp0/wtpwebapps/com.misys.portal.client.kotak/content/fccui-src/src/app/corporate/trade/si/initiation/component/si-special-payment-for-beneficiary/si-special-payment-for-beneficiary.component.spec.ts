import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SiSpecialPaymentForBeneficiaryComponent } from './si-special-payment-for-beneficiary.component';

describe('SiSpecialPaymentForBeneficiaryComponent', () => {
  let component: SiSpecialPaymentForBeneficiaryComponent;
  let fixture: ComponentFixture<SiSpecialPaymentForBeneficiaryComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SiSpecialPaymentForBeneficiaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SiSpecialPaymentForBeneficiaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
