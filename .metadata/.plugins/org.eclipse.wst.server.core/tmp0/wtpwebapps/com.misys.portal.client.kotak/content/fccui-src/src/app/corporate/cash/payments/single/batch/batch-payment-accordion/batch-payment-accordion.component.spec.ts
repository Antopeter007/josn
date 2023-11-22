import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BatchPaymentAccordionComponent } from './batch-payment-accordion.component';

describe('BatchPaymentAccordionComponent', () => {
  let component: BatchPaymentAccordionComponent;
  let fixture: ComponentFixture<BatchPaymentAccordionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BatchPaymentAccordionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BatchPaymentAccordionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
