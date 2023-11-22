import { TestBed } from '@angular/core/testing';

import { BeneficiaryProductService } from './beneficiary-product.service';

describe('BeneficiaryProductService', () => {
  let service: BeneficiaryProductService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BeneficiaryProductService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
