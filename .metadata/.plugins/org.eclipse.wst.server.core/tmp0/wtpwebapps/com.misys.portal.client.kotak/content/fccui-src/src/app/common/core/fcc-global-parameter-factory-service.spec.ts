import { TestBed } from '@angular/core/testing';

import { FccGlobalParameterFactoryService } from './fcc-global-parameter-factory-service';

describe('FccGlobalParameterFactoryService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: FccGlobalParameterFactoryService = TestBed.inject(FccGlobalParameterFactoryService);
    expect(service).toBeTruthy();
  });
});
