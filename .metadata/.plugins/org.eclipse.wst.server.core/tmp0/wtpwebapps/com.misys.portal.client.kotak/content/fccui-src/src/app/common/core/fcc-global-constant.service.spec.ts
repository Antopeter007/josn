import { TestBed } from '@angular/core/testing';

import { FccGlobalConstantService } from './fcc-global-constant.service';

describe('FccGlobalConstantService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: FccGlobalConstantService = TestBed.inject(FccGlobalConstantService);
    expect(service).toBeTruthy();
  });
});
