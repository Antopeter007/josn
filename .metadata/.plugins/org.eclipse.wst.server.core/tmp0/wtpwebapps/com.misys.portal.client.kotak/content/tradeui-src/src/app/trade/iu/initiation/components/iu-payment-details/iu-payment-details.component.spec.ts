import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { IuPaymentDetailsComponent } from './iu-payment-details.component';

describe('IuPaymentDetailsComponent', () => {
  let component: IuPaymentDetailsComponent;
  let fixture: ComponentFixture<IuPaymentDetailsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ IuPaymentDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IuPaymentDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
