import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BeneficiaryProductComponent } from './beneficiary-product.component';

describe('BeneficiaryProductComponent', () => {
  let component: BeneficiaryProductComponent;
  let fixture: ComponentFixture<BeneficiaryProductComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BeneficiaryProductComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BeneficiaryProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
