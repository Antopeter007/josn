import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EcPaymentDetailsComponent } from './ec-payment-details.component';

describe('EcPaymentDetailsComponent', () => {
  let component: EcPaymentDetailsComponent;
  let fixture: ComponentFixture<EcPaymentDetailsComponent>;

  // beforeEach(async(() => {
  //   TestBed.configureTestingModule({
  //     declarations: [ EcPaymentDetailsComponent ]
  //   })
  //   .compileComponents();
  // }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EcPaymentDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
