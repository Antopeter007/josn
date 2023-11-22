import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CuPaymentDetailsComponent } from './cu-payment-details.component';

describe('CuPaymentDetailsComponent', () => {
  let component: CuPaymentDetailsComponent;
  let fixture: ComponentFixture<CuPaymentDetailsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CuPaymentDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CuPaymentDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
