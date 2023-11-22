import { TestBed } from '@angular/core/testing';

import { AutoForwardService } from './auto-forward.service';

describe('AutoForwardService', () => {
  let service: AutoForwardService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AutoForwardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
