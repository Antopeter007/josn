import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CommonPaymentDetailsComponent } from './common-payment-details.component';

describe('CommonPaymentDetailsComponent', () => {
  let component: CommonPaymentDetailsComponent;
  let fixture: ComponentFixture<CommonPaymentDetailsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CommonPaymentDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CommonPaymentDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
