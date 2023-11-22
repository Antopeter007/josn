import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LnrpnInterestPaymentComponent } from './lnrpn-interest-payment.component';

describe('LnrpnInterestPaymentComponent', () => {
  let component: LnrpnInterestPaymentComponent;
  let fixture: ComponentFixture<LnrpnInterestPaymentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LnrpnInterestPaymentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LnrpnInterestPaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
