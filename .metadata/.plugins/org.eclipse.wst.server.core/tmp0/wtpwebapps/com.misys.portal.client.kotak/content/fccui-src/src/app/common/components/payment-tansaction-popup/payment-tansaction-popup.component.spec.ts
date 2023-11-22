import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentTansactionPopupComponent } from './payment-tansaction-popup.component';

describe('PaymentTansactionPopupComponent', () => {
  let component: PaymentTansactionPopupComponent;
  let fixture: ComponentFixture<PaymentTansactionPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PaymentTansactionPopupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentTansactionPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
