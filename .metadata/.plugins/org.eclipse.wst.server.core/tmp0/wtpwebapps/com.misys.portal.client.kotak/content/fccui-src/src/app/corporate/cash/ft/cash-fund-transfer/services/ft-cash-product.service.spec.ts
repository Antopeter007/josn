import { TestBed } from '@angular/core/testing';

import { FtCashProductService } from './ft-cash-product.service';

describe('FtCashProductService', () => {
  let service: FtCashProductService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FtCashProductService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
