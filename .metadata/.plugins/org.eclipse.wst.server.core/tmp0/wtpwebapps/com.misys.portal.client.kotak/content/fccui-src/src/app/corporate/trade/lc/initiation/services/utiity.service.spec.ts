import { TestBed } from '@angular/core/testing';

import { UtilityService } from './utility.service';

describe('UtiityService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: UtilityService = TestBed.inject(UtilityService);
    expect(service).toBeTruthy();
  });
});
