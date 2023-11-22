import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentOverviewSummaryComponent } from './payment-overview-summary.component';

describe('PaymentOverviewSummaryComponent', () => {
  let component: PaymentOverviewSummaryComponent;
  let fixture: ComponentFixture<PaymentOverviewSummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PaymentOverviewSummaryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentOverviewSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
