import { TestBed } from '@angular/core/testing';

import { LicenseDetailsHandlerService } from './license-details-handler.service';

describe('LicenseDetailsHandlerService', () => {
  let service: LicenseDetailsHandlerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LicenseDetailsHandlerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
