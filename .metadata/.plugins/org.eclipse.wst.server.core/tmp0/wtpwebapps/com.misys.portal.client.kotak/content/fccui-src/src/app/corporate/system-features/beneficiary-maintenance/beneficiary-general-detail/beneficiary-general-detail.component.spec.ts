import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BeneficiaryGeneralDetailComponent } from './beneficiary-general-detail.component';

describe('BeneficiaryGeneralDetailComponent', () => {
  let component: BeneficiaryGeneralDetailComponent;
  let fixture: ComponentFixture<BeneficiaryGeneralDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BeneficiaryGeneralDetailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BeneficiaryGeneralDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
