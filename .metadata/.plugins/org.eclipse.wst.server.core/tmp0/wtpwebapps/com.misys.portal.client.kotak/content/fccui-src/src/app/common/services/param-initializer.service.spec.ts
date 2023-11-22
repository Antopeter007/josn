import { TestBed } from '@angular/core/testing';

import { ParamInitializerService } from './param-initializer.service';

describe('ParamInitializerService', () => {
  let service: ParamInitializerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ParamInitializerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
