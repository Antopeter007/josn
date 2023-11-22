import { TestBed } from '@angular/core/testing';

import { FormControlResolverService } from './form-control-resolver.service';

describe('FormControlResolverService', () => {
  let service: FormControlResolverService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FormControlResolverService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
