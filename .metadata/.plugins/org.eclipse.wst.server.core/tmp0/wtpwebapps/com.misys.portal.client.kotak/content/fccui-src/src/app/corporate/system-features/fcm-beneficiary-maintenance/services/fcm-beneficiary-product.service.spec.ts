import { TestBed } from '@angular/core/testing';

import { FCMBeneficiaryProductService } from './fcm-beneficiary-product.service';

describe('BeneficiaryProductService', () => {
  let service: FCMBeneficiaryProductService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FCMBeneficiaryProductService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
