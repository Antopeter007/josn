import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SiPaymentDetailsComponent } from './si-payment-details.component';

describe('SiPaymentDetailsComponent', () => {
  let component: SiPaymentDetailsComponent;
  let fixture: ComponentFixture<SiPaymentDetailsComponent>;

  // beforeEach(async(() => {
  //   TestBed.configureTestingModule({
  //     declarations: [ SiPaymentDetailsComponent ]
  //   })
  //   .compileComponents();
  // }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SiPaymentDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
