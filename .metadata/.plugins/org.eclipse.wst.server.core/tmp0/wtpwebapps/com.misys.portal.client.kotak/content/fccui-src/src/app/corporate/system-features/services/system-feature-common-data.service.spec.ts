import { TestBed } from '@angular/core/testing';

import { SystemFeatureCommonDataService } from './system-feature-common-data.service';

describe('SystemFeatureCommonDataService', () => {
  let service: SystemFeatureCommonDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SystemFeatureCommonDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
