import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FCMBeneficiaryProductComponent } from './fcm-beneficiary-product.component';

describe('FcmBeneficiaryProductComponent', () => {
  let component: FCMBeneficiaryProductComponent;
  let fixture: ComponentFixture<FCMBeneficiaryProductComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FCMBeneficiaryProductComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FCMBeneficiaryProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
