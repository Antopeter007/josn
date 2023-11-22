import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FCMBeneficiaryGeneralDetailsComponent } from './fcm-beneficiary-general-details.component';

describe('FcmBeneficiaryGeneralDetailsComponent', () => {
  let component: FCMBeneficiaryGeneralDetailsComponent;
  let fixture: ComponentFixture<FCMBeneficiaryGeneralDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FCMBeneficiaryGeneralDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FCMBeneficiaryGeneralDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
