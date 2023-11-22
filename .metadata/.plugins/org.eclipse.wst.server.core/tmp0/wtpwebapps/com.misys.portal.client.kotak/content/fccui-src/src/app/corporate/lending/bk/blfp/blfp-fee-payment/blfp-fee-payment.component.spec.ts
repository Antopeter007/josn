import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BlfpFeePaymentComponent } from './blfp-fee-payment.component';

describe('BlfpFeePaymentComponent', () => {
  let component: BlfpFeePaymentComponent;
  let fixture: ComponentFixture<BlfpFeePaymentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BlfpFeePaymentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BlfpFeePaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
